// src/Components/Simulate/GameResult.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>⚠️ No simulation data found.</h2>
        <button
          onClick={() => navigate("/view-teams")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#fff",
            border: "1px solid black",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          🔙 Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ marginBottom: "2rem" }}>🏆 Game Result</h2>

      {/* Score Layout */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "4rem",
          marginBottom: "2.5rem"
        }}
      >
        {/* Team A */}
        <div style={{ minWidth: "150px" }}>
          <h3 style={{ marginBottom: "0.25rem" }}>{result.teamA}</h3>
          <div style={{ fontSize: "1.7rem", fontWeight: "bold" }}>{result.scoreA}</div>
        </div>

        {/* VS in the middle */}
        <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>VS</div>

        {/* Team B */}
        <div style={{ minWidth: "150px" }}>
          <h3 style={{ marginBottom: "0.25rem" }}>{result.teamB}</h3>
          <div style={{ fontSize: "1.7rem", fontWeight: "bold" }}>{result.scoreB}</div>
        </div>
      </div>

      {/* MVP Box */}
      <div
        style={{
          display: "inline-block",
          border: "1px solid black",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          backgroundColor: "#f9f9f9"
        }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0" }}>🏅 MVP</h4>
        <p style={{ margin: 0 }}>{result.mvp}</p>
      </div>

      {/* Summary Box */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "0 auto"
        }}
      >
        <p>{result.summary}</p>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/view-teams")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#fff",
            border: "1px solid black",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          🔙 Back to Teams
        </button>
      </div>
    </div>
  );
}
