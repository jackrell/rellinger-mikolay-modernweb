// src/Components/Auth/AuthLogin.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../Common/Services/AuthService";

export default function AuthLogin() {
  // State variables for user input and error display
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await logIn(username, password); // Attempt to log in with Parse
      navigate("/manage-teams"); // Redirect on success
    } catch (err) {
      setError("Invalid credentials. Please try again."); // Show error on failure
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Username input */}
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

      {/* Password input */}
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
        Login
      </button>
    </form>
  );
}
