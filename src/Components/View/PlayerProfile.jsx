// src/Components/View/PlayerProfile.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerByName } from "../../services/GetData";

export default function PlayerProfile() {
  const { playerId } = useParams(); // Extract player name from the URL
  const navigate = useNavigate();   // Used to go back to the previous page
  const [player, setPlayer] = useState(null); // Local state for the player object

  // Fetch the player object when the component mounts or playerId changes
  useEffect(() => {
    const loadPlayer = async () => {
      const match = await getPlayerByName(decodeURIComponent(playerId));
      setPlayer(match);
    };
    loadPlayer();
  }, [playerId]);

  // Converts height in cm to feet/inches format
  const formatHeight = (cm) => {
    if (!cm) return "N/A";
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  };

  // Converts weight in kg to pounds
  const formatWeight = (kg) => {
    if (!kg) return "N/A";
    return `${Math.round(kg * 2.20462)} lbs`;
  };

  // Show loading screen while player is being fetched
  if (!player) return <div style={{ padding: "2rem" }}>Loading player profile...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👤 {player.name}</h2>
      <p><strong>Team:</strong> {player.team}</p>
      <p><strong>College:</strong> {player.college || "N/A"}</p>
      <p><strong>Height:</strong> {formatHeight(player.height)}</p>
      <p><strong>Weight:</strong> {formatWeight(player.weight)}</p>
      <hr />
      <h4>📊 2022–23 Season Averages</h4>
      <p><strong>PPG:</strong> {player.ppg ?? "N/A"}</p>
      <p><strong>RPG:</strong> {player.rpg ?? "N/A"}</p>
      <p><strong>APG:</strong> {player.apg ?? "N/A"}</p>

      {/* Back Button to return to the previous page */}
      <button
        onClick={() => navigate(-1)}
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
        🔙 Back to Team Details
      </button>
    </div>
  );
}
