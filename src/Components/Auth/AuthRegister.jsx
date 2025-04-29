// src/Components/Auth/AuthRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../Common/Services/AuthService";

export default function AuthRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Attempt to register the user
      await signUp(username, email, password);
      // Redirect to Manage Teams on success
      navigate("/manage-teams");
    } catch (err) {
      // Display any error returned from AuthService
      setError(err.message || "Failed to create account.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      
      {/* Display error message if registration fails */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Username Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition"
      >
        Create Account
      </button>
    </form>
  );
}

