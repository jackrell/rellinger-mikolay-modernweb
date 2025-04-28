// src/Components/Simulate/BoxScore.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BoxScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const { boxScore, teamA, teamB } = location.state || {};

  if (!boxScore) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>⚠️ No box score data found.</h2>
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

  // Separate players by team
  const playersA = boxScore.filter(p => p.team === "A");
  const playersB = boxScore.filter(p => p.team === "B");

  const renderTable = (teamName, players) => (
    <div style={{ marginBottom: "2.5rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>{teamName}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Player</th>
            <th style={thStyle}>PTS</th>
            <th style={thStyle}>REB</th>
            <th style={thStyle}>AST</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <tr key={idx} style={{ textAlign: "center" }}>
              <td style={tdStyle}>{player.name}</td>
              <td style={tdStyle}>{player.pts}</td>
              <td style={tdStyle}>{player.reb}</td>
              <td style={tdStyle}>{player.ast}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const thStyle = {
    padding: "0.75rem",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    fontSize: "0.95rem"
  };

  const tdStyle = {
    padding: "0.6rem",
    borderBottom: "1px solid #ddd",
    fontSize: "0.9rem"
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>📋 Full Box Score</h2>

      {renderTable(teamA, playersA)}
      {renderTable(teamB, playersB)}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
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
