import React from "react";

const GoogleButton = () => {
  return (
    <button
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
        cursor: "pointer",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google Logo"
        style={{ width: "20px", height: "20px" }}
      />
      <span style={{ color: "#444" }}>Sign up with Google</span>
    </button>
  );
};

export default GoogleButton;
