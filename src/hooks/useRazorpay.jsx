import { useCallback, useState } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

// Mirrors the same base URL logic used in instanceAPI (axios config)
const BASE_URL =
  window?.config?.ApiUrl ||
  "https://api.empikaai.com/api";

/**
 * Dynamically loads the Razorpay checkout.js script exactly once.
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("razorpay-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * fetch wrapper that mirrors axios instanceAPI behaviour:
 *  - Uses the same BASE_URL
 *  - Sends cookies via credentials: "include"  (equivalent to withCredentials: true)
 *  - Throws a descriptive Error on network failures or non-2xx responses
 */
async function apiFetch(path, body) {
  const url = `${BASE_URL}${path}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      credentials: "include", // ✅ sends session cookie — same as axios withCredentials: true
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error(
      `Network error: could not reach ${url}. (${networkErr.message})`,
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(
      `Server returned ${res.status} ${res.statusText} with a non-JSON body.`,
    );
  }

  if (!res.ok) {
    // FastAPI validation errors: { detail: [{msg, loc, type}] } or { detail: "string" }
    const detail = data?.detail;
    const msg = Array.isArray(detail)
      ? detail.map((d) => `${d.loc?.join(".")} — ${d.msg}`).join("; ")
      : typeof detail === "string"
        ? detail
        : JSON.stringify(data);

    throw new Error(`[HTTP ${res.status}] ${msg}`);
  }

  return data;
}

/**
 * useRazorpay
 *
 * Full Razorpay payment lifecycle with cookie-based auth:
 *   1. POST /billing/create-order  → order_id, amount (paise), currency, key_id
 *   2. Open Razorpay checkout popup
 *   3. POST /billing/verify-payment → signature verification
 *
 * @param {object}   options
 * @param {string}   [options.name]        Business name shown in Razorpay popup
 * @param {string}   [options.description] Plan label shown in popup
 * @param {string}   [options.image]       Logo URL shown in popup
 * @param {object}   [options.prefill]     { name, email, contact }
 * @param {Function} [options.onSuccess]   Called with verify-payment response on success
 * @param {Function} [options.onError]     Called with Error on any failure
 *
 * @returns {{ initiate: Function, loading: boolean, error: string|null }}
 */
export function useRazorpay({
  name = "EmpikaAI",
  description = "Professional Plan",
  image,
  prefill = {},
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ── 1. Load Razorpay SDK ───────────────────────────────────────────────
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error(
          "Failed to load Razorpay script. Check your internet connection or ad-blocker.",
        );
      }

      // ── 2. Create order ────────────────────────────────────────────────────
      const orderData = await apiFetch("/billing/create-order", {
        plan_code: "professional",
      });

      const {
        order_id,
        amount: orderAmount,
        currency: orderCurrency,
        key_id,
      } = orderData;

      if (!order_id || !key_id) {
        throw new Error(
          `Backend response missing order_id or key_id. Got: ${JSON.stringify(orderData)}`,
        );
      }

      // ── 3. Open Razorpay checkout ──────────────────────────────────────────
      const verifyData = await new Promise((resolve, reject) => {
        const options = {
          key: key_id,
          amount: orderAmount, // paise (INR) as returned by backend
          currency: orderCurrency, // "INR"
          name,
          description,
          image,
          order_id,
          prefill,
          theme: { color: "#2563eb" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled by user.")),
          },
          handler: async (response) => {
            // ── 4. Verify payment signature ──────────────────────────────────
            try {
              const result = await apiFetch("/billing/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve(result);
            } catch (verifyErr) {
              reject(verifyErr);
            }
          },
        };

        // eslint-disable-next-line no-undef
        const rzp = new Razorpay(options);
        rzp.on("payment.failed", (res) => {
          reject(
            new Error(
              res?.error?.description ||
                `Payment failed (code: ${res?.error?.code})`,
            ),
          );
        });
        rzp.open();
      });

      onSuccess?.(verifyData);
    } catch (err) {
      console.error("[useRazorpay]", err.message);
      setError(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [name, description, image, prefill, onSuccess, onError]);

  return { initiate, loading, error };
}
