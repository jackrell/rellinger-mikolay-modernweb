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
  // simulates from out backend
  const handleSimulation = async () => {
    setLoading(true);
    // our backend api
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

  // renders the team, sorting if there is positional data
  const renderTeamColumn = (team) => {
    const sortedPlayers = [...team.players].sort((a, b) => {
      const positionOrder = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
      const aPos = positionOrder[a.position] || 99;
      const bPos = positionOrder[b.position] || 99;
      return aPos - bPos;
    });

    return (
      <div className="flex-1 bg-neutral-800 p-6 rounded-lg text-center shadow-md min-w-[250px]">
        <h2 className="text-2xl font-bold mb-6">{team.name}</h2>
        <ul className="space-y-2 mb-6">
          {sortedPlayers.map((player, index) => (
            <li key={index}>
              <strong>{player.name}</strong>
              {player.position ? ` (${player.position})` : ""}
            </li>
          ))}
        </ul>
        <p className="italic text-gray-400 text-sm">
          Created by: {team.createdByUsername || "Unknown"}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 relative">
      {/* Cancel button */}
      <button
        onClick={() => navigate("/view-teams")}
        className="absolute top-8 left-8 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition text-white"
      >
        ❌ Cancel
      </button>

      <h2 className="text-3xl font-bold text-center mb-12">🏀 Game Preview</h2>

      {/* Teams Preview */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
        {renderTeamColumn(teamA)}
        <div className="text-3xl font-bold">VS</div>
        {renderTeamColumn(teamB)}
      </div>

      {/* Start Simulation Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSimulation}
          disabled={loading}
          className={`px-8 py-4 text-lg font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          🧠 {loading ? "Simulating..." : "Start Simulation"}
        </button>
      </div>
    </div>
  );
}
