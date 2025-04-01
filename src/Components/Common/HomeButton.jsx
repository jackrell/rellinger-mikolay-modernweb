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
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#fff",
        color: "#333",
        border: "1px solid black",
        cursor: "pointer",
        zIndex: 999
      }}
    >
      🏠 Home
    </button>
  );
}
