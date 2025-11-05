import React, { useState } from "react";
import GoogleButton from "../components/Auth/GoogleButton"; // ✅ Import Google Button

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup clicked:", formData);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.title}>Sign Up</h2>

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

        {/* ✅ Regular Sign Up Button */}
        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        {/* ✅ Google Sign Up Button at Bottom */}
        <div style={{ marginTop: "1rem" }}>
          <GoogleButton />
        </div>
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
};

export default SignupPage;
