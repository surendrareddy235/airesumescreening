// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook

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

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Signup
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
      setSuccess("Signup successful! Enter the verification code sent to your email.");
      setVerifyStep(true); // Show OTP input
    } catch (err) {
      console.error(err);
      if (err.response) setError(err.response.data.message || "Signup failed");
      else setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
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

      // Reset form data
      setFormData({ username: "", email: "", password: "" });
      setCode("");

      // ✅ Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      if (err.response) setError(err.response.data.message || "Verification failed");
      else setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={verifyStep ? handleVerify : handleSignup} style={styles.form}>
        <h2 style={styles.title}>{verifyStep ? "Verify Email" : "Sign Up"}</h2>

        {!verifyStep && (
          <>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              style={styles.input}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={styles.input}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={styles.input}
              required
            />
          </>
        )}

        {verifyStep && (
          <>
            <label>Verification Code</label>
            <input
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              style={styles.input}
              required
            />
          </>
        )}

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading
            ? verifyStep
              ? "Verifying..."
              : "Signing up..."
            : verifyStep
            ? "Verify"
            : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    width: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    padding: "0.5rem",
    margin: "0.5rem 0 1rem 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.7rem",
    border: "none",
    borderRadius: "4px",
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  success: {
    color: "green",
    marginBottom: "1rem",
  },
};

export default SignupPage;