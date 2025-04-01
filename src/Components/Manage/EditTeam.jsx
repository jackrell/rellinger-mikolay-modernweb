// src/Components/Manage/EditTeam.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchPlayers } from "../../services/GetData";
import { getTeamById, updateTeam } from "../../Common/Services/ManageService";

export default function EditTeam() {
  const { teamId } = useParams(); // Get the team ID from the route parameters
  const navigate = useNavigate();

  // State management
  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load the current team from the database on component mount
  useEffect(() => {
    const loadTeam = async () => {
      try {
        if (!teamId) {
          console.error("No teamId in URL.");
          return;
        }

        const teamObj = await getTeamById(teamId);
        if (!teamObj) throw new Error("Team not found");

        // Populate the team name and player list from backend
        setTeamName(teamObj.get("name"));
        setSelectedPlayers(teamObj.get("players") || []);
      } catch (err) {
        console.error("Failed to load team:", err.message);
      }
    };
    loadTeam();
  }, [teamId]);

  // Handle player search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchPlayers(searchQuery);
      const limited = results.slice(0, 10); // Show top 10 results
      setSearchResults(limited);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // Add a player to the selected list (if not already added and under 5 total)
  const handleAddPlayer = (player) => {
    if (selectedPlayers.length < 5 && !selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Remove a player from the selected list by index
  const handleRemovePlayer = (indexToRemove) => {
    setSelectedPlayers((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Save changes to the backend
  const handleSaveChanges = async () => {
    if (!teamName || selectedPlayers.length !== 5) {
      alert("Please enter a team name and select exactly 5 players.");
      return;
    }

    try {
      await updateTeam(teamId, {
        name: teamName,
        players: selectedPlayers,
      });
      navigate("/manage-teams");
    } catch (err) {
      console.error("Error updating team:", err.message);
      alert("Failed to save changes.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>✏️ Edit Team</h2>

      {/* Team Name Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          />
        </label>
      </div>

      {/* Search Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>🔍 Search and Add Players</h3>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>

        {/* Search Results */}
        <div style={{ marginTop: "1rem" }}>
          {searchResults.map((player, index) => (
            <div key={index} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}>
              <strong>{player.name}</strong> — {player.team || "N/A"}
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"}, APG: {player.apg ?? "N/A"}
              </div>
              <button onClick={() => handleAddPlayer(player)} style={{ marginTop: "0.5rem" }}>
                ➕ Add to Team
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Players Section */}
      <div>
        <h3>🏀 Selected Players ({selectedPlayers.length}/5)</h3>
        <ul>
          {selectedPlayers.map((player, index) => (
            <li key={index}>
              {player.name}
              <button onClick={() => handleRemovePlayer(index)} style={{ marginLeft: "1rem" }}>
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Save Button */}
        <button onClick={handleSaveChanges} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}
