// src/Components/Simulate/GamePreview.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GamePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamA, teamB } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!teamA || !teamB) {
    return (
      <p style={{ padding: "2rem" }}>
        Error: Two teams must be selected for simulation.
      </p>
    );
  }

  const handleSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/simulate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA, teamB }),
      });

      const data = await response.json();

      if (data.result) {
        console.log("Simulation result:", data.result);
        navigate("/simulate/result", { state: { result: data.result } });
      } else {
        throw new Error("Simulation response did not include a result.");
      }
    } catch (err) {
      console.error("Simulation failed:", err);
      alert("Something went wrong with the simulation.");
    } finally {
      setLoading(false);
    }
  };

  const renderTeamColumn = (team) => {
    // Sort players if positions exist
    const sortedPlayers = [...team.players].sort((a, b) => {
      const positionOrder = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
      const aPos = positionOrder[a.position] || 99;
      const bPos = positionOrder[b.position] || 99;
      return aPos - bPos;
    });

    return (
      <div
        style={{
          flex: 1,
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{team.name}</h2>
        <ul style={{ listStyleType: "none", padding: 0, marginTop: "1rem" }}>
          {sortedPlayers.map((player, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              <strong>{player.name}</strong>
              {player.position ? ` (${player.position})` : ""}
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
    <div style={{ padding: "2rem", position: "relative" }}>
      {/* Cancel button */}
      <button
        onClick={() => navigate("/view-teams")}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          padding: "0.4rem 1rem",
          fontSize: "0.9rem",
          backgroundColor: "#fff",
          border: "1px solid black",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        ❌ Cancel
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        🏀 Game Preview
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {renderTeamColumn(teamA)}
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>VS</div>
        {renderTeamColumn(teamB)}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleSimulation}
          disabled={loading}
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#fff",
            border: "1px solid black",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "4px",
          }}
        >
          🧠 {loading ? "Simulating..." : "Start Simulation"}
        </button>
      </div>
    </div>
  );
}
