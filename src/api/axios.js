import axios from "axios";
import { API_URL } from "../config";

const instanceAPI = axios.create({
    baseURL: API_URL,
    withCredentials: true, // ✅ COOKIE AUTH
});

instanceAPI.interceptors.response.use(
    (response) => {
        console.log(
            "✅ API SUCCESS:",
            response.config.url,
            "Status:",
            response.status
        );
        return response;
    },
    (error) => {
        console.group("❌ API ERROR");

        console.log("URL:", error.config?.url);
        console.log("Method:", error.config?.method);
        console.log("Status:", error.response?.status);
        console.log("Response Data:", error.response?.data);
        console.log("Headers:", error.response?.headers);
        // Note: HttpOnly cookies are not visible to JS, so we cannot log them here.
        // We rely on the browser's Network tab to verify if cookies are sent.

        console.groupEnd();

        if (error.response?.status === 401) {
            console.warn("🚨 Unauthorized – redirecting to login");
            // window.location.href = "/login"; // login page
        }

        return Promise.reject(error);
    }
);

export { instanceAPI };
