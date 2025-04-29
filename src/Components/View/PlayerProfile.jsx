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
  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <p className="text-xl">Loading player profile...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Player Name */}
        <h2 className="text-3xl font-bold mb-8">👤 {player.name}</h2>
  
        {/* Player Info */}
        <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4 mb-12">
          <p><span className="font-semibold">🏀 Team:</span> {player.team || "N/A"}</p>
          <p><span className="font-semibold">🎓 College:</span> {player.college || "N/A"}</p>
          <p><span className="font-semibold">📏 Height:</span> {formatHeight(player.height)}</p>
          <p><span className="font-semibold">⚖️ Weight:</span> {formatWeight(player.weight)}</p>
        </div>
  
        {/* Season Averages */}
        <h3 className="text-2xl font-semibold mb-6">📊 2022–23 Season Averages</h3>
        <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4 mb-12">
          <p><span className="font-semibold">PPG:</span> {player.ppg ?? "N/A"}</p>
          <p><span className="font-semibold">RPG:</span> {player.rpg ?? "N/A"}</p>
          <p><span className="font-semibold">APG:</span> {player.apg ?? "N/A"}</p>
        </div>
  
        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition"
          >
            🔙 Back to Team Details
          </button>
        </div>
      </div>
    </div>
  );
}
