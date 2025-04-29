// src/Components/Simulate/GameResult.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  // If no simulation result is available, show a simple error + back button
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-900 text-white p-8">
        <h2 className="text-2xl font-bold mb-6">
          ⚠️ No simulation data found.
        </h2>
        <button
          onClick={() => navigate("/view-teams")}
          className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
        >
          🔙 Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Page Title */}
        <h2 className="text-3xl font-bold mb-12">🏆 Game Result</h2>

        {/* Team Scores */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-12">
          {/* Team A Card */}
          <div className="bg-neutral-800 p-6 rounded-lg w-48 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{result.teamA}</h3>
            <div className="text-3xl font-bold">{result.scoreA}</div>
          </div>

          {/* VS Divider */}
          <div className="text-2xl font-bold">VS</div>

          {/* Team B Card */}
          <div className="bg-neutral-800 p-6 rounded-lg w-48 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{result.teamB}</h3>
            <div className="text-3xl font-bold">{result.scoreB}</div>
          </div>
        </div>

        {/* MVP Player Box */}
        <div className="inline-block bg-neutral-800 p-6 rounded-lg shadow-md mb-12">
          <h4 className="text-xl font-semibold mb-2">🏅 MVP</h4>
          <p className="text-lg">{result.mvp}</p>
        </div>

        {/* Game Summary */}
        <div className="bg-neutral-800 p-6 rounded-lg shadow-md mb-12 max-w-2xl mx-auto">
          <p className="text-gray-300">{result.summary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* View Full Box Score Button */}
          <button
            onClick={() =>
              navigate("/simulate/boxscore", {
                state: {
                  boxScore: result.boxScore,
                  teamA: result.teamA,
                  teamB: result.teamB,
                },
              })
            }
            className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
          >
            📋 View Full Box Score
          </button>

          {/* Back to Teams Button */}
          <button
            onClick={() => navigate("/view-teams")}
            className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
          >
            🔙 Back to Teams
          </button>
        </div>
      </div>
    </div>
  );
}
