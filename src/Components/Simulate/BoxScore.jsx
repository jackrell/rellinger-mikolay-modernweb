// src/Components/Simulate/BoxScore.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BoxScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const { boxScore, teamA, teamB } = location.state || {};

  // If no box score available, show fallback screen
  if (!boxScore) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-900 text-white p-8">
        <h2 className="text-2xl font-bold mb-6">⚠️ No box score data found.</h2>
        <button
          onClick={() => navigate("/view-teams")}
          className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          🔙 Back to Teams
        </button>
      </div>
    );
  }

  // Separate players by team
  const playersA = boxScore.filter((p) => p.team === "A");
  const playersB = boxScore.filter((p) => p.team === "B");

  // Renders a table for each team
  const renderTable = (teamName, players) => (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-center mb-6">{teamName}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-800">
            <tr>
              <th className="p-4 border-b border-neutral-700 text-left">
                Player
              </th>
              <th className="p-4 border-b border-neutral-700 text-center">
                PTS
              </th>
              <th className="p-4 border-b border-neutral-700 text-center">
                REB
              </th>
              <th className="p-4 border-b border-neutral-700 text-center">
                AST
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr
                key={idx}
                className="border-b border-neutral-800 hover:bg-neutral-800 transition"
              >
                <td className="p-4 text-left">{player.name}</td>
                <td className="p-4 text-center">{player.pts}</td>
                <td className="p-4 text-center">{player.reb}</td>
                <td className="p-4 text-center">{player.ast}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const thStyle = {
    padding: "0.75rem",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    fontSize: "0.95rem",
  };

  const tdStyle = {
    padding: "0.6rem",
    borderBottom: "1px solid #ddd",
    fontSize: "0.9rem",
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-center mb-12">
          📋 Full Box Score
        </h2>

        {/* Team A Table */}
        {renderTable(teamA, playersA)}

        {/* Team B Table */}
        {renderTable(teamB, playersB)}

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/view-teams")}
            className="px-8 py-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            🔙 Back to Teams
          </button>
        </div>
      </div>
    </div>
  );
}
