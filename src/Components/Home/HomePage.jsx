// src/Components/Home/HomePage.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logOut } from "../../Common/Services/AuthService";

export default function HomePage() {
  const user = getCurrentUser(); // Get the currently logged-in user
  const navigate = useNavigate();

  // Handles login or logout action depending on user state
  const handleAuthAction = async () => {
    if (user) {
      await logOut(); // If logged in, log out
      navigate("/");  // Redirect to homepage after logout
    } else {
      navigate("/auth"); // If not logged in, go to login/register
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", position: "relative" }}>
      {/* Top-right auth section */}
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}>
        {user ? (
          <>
            {/* Show username and logout if user is signed in */}
            <span style={{ fontSize: "0.9rem", color: "#555" }}>
              Signed in as: <strong>{user.get("username")}</strong>
            </span>
            <button
              onClick={handleAuthAction}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid black",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Show register/login buttons if user is not signed in */}
            <button
              onClick={() => navigate("/auth?register=true")}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid black",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              Register
            </button>
            <button
              onClick={handleAuthAction}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid black",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* App title and description */}
      <h1>🏀 NBA Team Builder</h1>
      <p>Draft your own team or explore teams created by others!</p>

      {/* Navigation buttons to main features */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "2rem"
      }}>
        <Link to="/view-teams">
          <button style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            cursor: "pointer"
          }}>
            View All Teams
          </button>
        </Link>
        <Link to="/manage-teams">
          <button style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            cursor: "pointer"
          }}>
            Manage My Teams
          </button>
        </Link>
      </div>
    </div>
  );
}
