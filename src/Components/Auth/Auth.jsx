// src/Components/Auth/Auth.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../Common/Services/AuthService";
import AuthLogin from "./AuthLogin";
import AuthRegister from "./AuthRegister";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true); // toggle between login and register tabs

  const user = getCurrentUser(); // get current user from Parse

  useEffect(() => {
    if (user) {
      navigate("/manage-teams"); // redirect authenticated users away from auth page
    }

    // If user clicked "Register" or has "?register=true" in URL, show register tab
    const params = new URLSearchParams(location.search);
    if (params.get("register") === "true") {
      setIsLogin(false);
    }
  }, [user, navigate, location.search]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{isLogin ? "🔐 Login to Your Account" : "📝 Create a New Account"}</h2>

      {/* Tab toggle buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setIsLogin(true)}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            backgroundColor: isLogin ? "#333" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: !isLogin ? "#333" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Register
        </button>
      </div>

      {/* Render login or register component based on tab */}
      {isLogin ? <AuthLogin /> : <AuthRegister />}

      {/* Optional message for users redirected to auth page due to protected route */}
      {location.search.includes("redirect") && (
        <p style={{ marginTop: "1rem", color: "#888" }}>
          You must be logged in to access that page.
        </p>
      )}
    </div>
  );
}
