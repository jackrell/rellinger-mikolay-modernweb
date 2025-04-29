// src/Components/Auth/Auth.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../Common/Services/AuthService";
import AuthLogin from "./AuthLogin";
import AuthRegister from "./AuthRegister";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Check if the user is already logged in
  const user = getCurrentUser();

  useEffect(() => {
    // If user is authenticated, redirect to Manage Teams
    if (user) {
      navigate("/manage-teams");
    }

    // Check if coming from a register link (ex: ?register=true)
    const params = new URLSearchParams(location.search);
    if (params.get("register") === "true") {
      setIsLogin(false);
    }
  }, [user, navigate, location.search]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center">
      
      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-8">
        {isLogin ? "🔐 Login to Your Account" : "📝 Create a New Account"}
      </h2>

      {/* Toggle Buttons: Login / Register */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            !isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          Register
        </button>
      </div>

      {/* Login or Register Form */}
      {isLogin ? <AuthLogin /> : <AuthRegister />}

      {/* Notice if redirected from protected route */}
      {location.search.includes("redirect") && (
        <p className="text-gray-400 italic mt-6">
          You must be logged in to access that page.
        </p>
      )}
    </div>
  );
}
