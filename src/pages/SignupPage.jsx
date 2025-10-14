// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyStep, setVerifyStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://airs.loca.lt/api/auth/signup",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup successful:", response.data);
      setSuccess(
        "Signup successful! Enter the verification code sent to your email."
      );
      setVerifyStep(true);
    } catch (err) {
      console.error(err);
      if (err.response) setError(err.response.data.message || "Signup failed");
      else setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://airs.loca.lt/api/auth/verify",
        {
          email: formData.email,
          code: code,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Verification successful:", response.data);
      setSuccess("Email verified successfully! Redirecting to login...");
      setVerifyStep(false);

      setFormData({ username: "", email: "", password: "" });
      setCode("");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      if (err.response)
        setError(err.response.data.message || "Verification failed");
      else setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>

      <div style={styles.formCard}>
        <div style={styles.header}>
          {verifyStep ? (
            <>
              <div style={styles.iconWrapper}>
                <svg
                  style={styles.verifyIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 style={styles.title}>Check Your Email</h1>
              <p style={styles.subtitle}>
                We've sent a verification code to{" "}
                <strong>{formData.email}</strong>
              </p>
            </>
          ) : (
            <>
              <h1 style={styles.title}>Create Account</h1>
              <p style={styles.subtitle}>Join us today and get started</p>
            </>
          )}
        </div>

        <form
          onSubmit={verifyStep ? handleVerify : handleSignup}
          style={styles.form}
        >
          {!verifyStep && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <svg
                    style={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <svg
                    style={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <svg
                    style={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    style={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </>
          )}

          {verifyStep && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Code</label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  style={styles.input}
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <svg
                style={styles.errorIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.successBox}>
              <svg
                style={styles.successIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <span style={styles.loadingSpinner}>
                {verifyStep ? "⏳ Verifying..." : "⏳ Creating Account..."}
              </span>
            ) : verifyStep ? (
              "Verify Email"
            ) : (
              "Create Account"
            )}
          </button>

          {!verifyStep && (
            <>
              <div style={styles.divider}>
                <span style={styles.dividerText}>or</span>
              </div>

              <p style={styles.loginText}>
                Already have an account?{" "}
                <Link to="/" style={styles.loginLink}>
                  Sign In
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  backgroundShapes: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  shape1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "400px",
    height: "400px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    filter: "blur(60px)",
  },
  shape2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    filter: "blur(80px)",
  },
  shape3: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "300px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    filter: "blur(100px)",
  },
  formCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  verifyIcon: {
    width: "32px",
    height: "32px",
    color: "#fff",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "16px",
    width: "20px",
    height: "20px",
    color: "#a0aec0",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  eyeButton: {
    position: "absolute",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#fee",
    color: "#c53030",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid #86efac",
  },
  successIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },
  button: {
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(240, 147, 251, 0.4)",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    margin: "24px 0",
    height: "1px",
    background: "#e2e8f0",
  },
  dividerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "0 16px",
    fontSize: "14px",
    color: "#a0aec0",
  },
  loginText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#4a5568",
  },
  loginLink: {
    color: "#f5576c",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
};

export default SignupPage;
