// src/Components/Common/HomeButton.jsx
// Code to have universal home button

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomeButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null; // Don't show on homepage

  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-6 right-6 z-50 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-semibold transition"
    >
      🏠 Home
    </button>
  );
}
