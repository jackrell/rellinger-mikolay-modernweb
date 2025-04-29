// src/Components/View/TeamDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamById } from "../../Common/Services/ManageService";

export default function TeamDetails() {
  const { teamId } = useParams(); // Get team ID from route parameters
  const navigate = useNavigate(); // Navigation hook to programmatically change routes
  const [team, setTeam] = useState(null); // Local state to hold team object

  // Load team data when the component mounts or teamId changes
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teamObj = await getTeamById(teamId); // Fetch team from backend
        setTeam(teamObj); // Set the team into state
      } catch (err) {
        console.error("Failed to load team:", err); // Error handling
      }
    };
    loadTeam();
  }, [teamId]);

  // Show loading text while team is being fetched
  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <p className="text-xl">Loading team details...</p>
      </div>
    );
  }

  const username = team.get("createdByUsername") || "Unknown";

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Team Name */}
        <h2 className="text-3xl font-bold mb-8">
          📋 Team Details: {team.get("name")}
        </h2>

        {/* Players List */}
        <h3 className="text-2xl font-semibold mb-6">Players</h3>
        <ul className="space-y-4 mb-12">
          {Array.isArray(team.get("players")) ? (
            [...team.get("players")]
              .sort((a, b) => {
                const positionOrder = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
                return (
                  (positionOrder[a.position] || 99) -
                  (positionOrder[b.position] || 99)
                );
              })
              .map((player, index) => (
                <li
                  key={index}
                  className="bg-neutral-800 p-4 rounded-lg shadow-md"
                >
                  <p className="text-lg font-semibold mb-1">
                    {player.name}{" "}
                    <span className="text-gray-400 text-sm">
                      {player.position ? `(${player.position})` : ""}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    {player.team || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"}, APG:{" "}
                    {player.apg ?? "N/A"}
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/player/${encodeURIComponent(player.name)}`)
                    }
                    className="px-3 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition text-sm"
                  >
                    🔍 View Profile
                  </button>
                </li>
              ))
          ) : (
            <li>No players found.</li>
          )}
        </ul>

        {/* Creator Info */}
        <p className="italic text-gray-400 mb-12">Created by: {username}</p>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/view-teams")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg transition"
          >
            🔙 Back to All Teams
          </button>
        </div>
      </div>
    </div>
  );
}
