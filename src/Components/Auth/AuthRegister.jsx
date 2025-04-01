// src/Components/Auth/AuthRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../Common/Services/AuthService";

export default function AuthRegister() {
  // State variables for form fields and error handling
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      await signUp(username, email, password); // Register user via Parse
      navigate("/manage-teams"); // Redirect to manage teams on success
    } catch (err) {
      setError(err.message || "Failed to create account."); // Show error on failure
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Username field */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Email field */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Password field */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Submit button */}
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>
        Create Account
      </button>
    </form>
  );
}
