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
  if (!team) return <p>Loading team details...</p>;

  // Get username of the team creator, or show "Unknown" if not found
  const username = team.get("createdByUsername") || "Unknown";

  return (
    <div style={{ padding: "2rem" }}>
      {/* Team Name */}
      <h2>📋 Team Details: {team.get("name")}</h2>

      {/* Roster List */}
      <h3>Players:</h3>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {Array.isArray(team.get("players")) ? (
          team.get("players").map((player, index) => (
            <li key={index} style={{ marginBottom: "1rem" }}>
              <strong>{player.name}</strong> — {player.team || "N/A"}<br />
              PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"}, APG: {player.apg ?? "N/A"}<br />
              {/* Button to navigate to player profile page */}
              <button
                onClick={() => navigate(`/player/${encodeURIComponent(player.name)}`)}
                style={{
                  marginTop: "0.5rem",
                  cursor: "pointer"
                }}
              >
                🔍 View Player Profile
              </button>
            </li>
          ))
        ) : (
          <li>No players found.</li> // Fallback if no players are listed
        )}
      </ul>

      {/* Creator Info */}
      <p style={{ fontStyle: "italic", marginTop: "1rem", color: "#555" }}>
        Created by: {username}
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate("/view-teams")}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#fff",
          color: "#000",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        🔙 Back to All Teams
      </button>
    </div>
  );
}
