// src/Components/Simulate/GamePreview.jsx

import React from "react";
import { useLocation } from "react-router-dom";

export default function GamePreview() {
  const location = useLocation();
  const { teamA, teamB } = location.state || {};

  if (!teamA || !teamB) {
    return <p style={{ padding: "2rem" }}>Error: Two teams must be selected for simulation.</p>;
  }

  const renderTeamColumn = (team) => {
    return (
      <div
        style={{
          flex: 1,
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginTop: 0 }}>{team.name}</h2>
        <ul style={{ listStyleType: "none", padding: 0, marginTop: "1rem" }}>
          {team.players.map((player, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              {player.name}
            </li>
          ))}
        </ul>
        <p style={{ fontStyle: "italic", color: "#555" }}>
          Created by: {team.createdByUsername || "Unknown"}
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🏀 Game Preview</h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
        {renderTeamColumn(teamA)}

        <div style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 1rem" }}>VS</div>

        {renderTeamColumn(teamB)}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#fff",
            border: "1px solid black",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          🧠 Start Simulation
        </button>
      </div>
    </div>
  );
}
