// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Login request payload:", formData);

      const response = await axios.post(
        "http://airs.loca.lt/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login successful:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        console.error("Full backend error response:", err.response);
        const backendMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Login failed. Please check your credentials.";
        setError(backendMessage);
      } else if (err.request) {
        setError("Server did not respond. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
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
                placeholder="Enter your password"
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

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <span style={styles.loadingSpinner}>⏳ Logging in...</span>
            ) : (
              "Sign In"
            )}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <p style={styles.signupText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.signupLink}>
              Create Account
            </Link>
          </p>
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
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
  button: {
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
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
  signupText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#4a5568",
  },
  signupLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
};

export default LoginPage;
