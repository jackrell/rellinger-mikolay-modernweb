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
    if (!teamName || selectedPlayers.length !== 5 || selectedPlayers.some(p => !p.position)) {
      alert("Please enter a team name, select exactly 5 players, and assign a position to each player.");
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
  

  const handleChangePosition = (index, newPosition) => {
    setSelectedPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], position: newPosition };
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 relative">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">✏️ Edit Team</h1>
  
        {/* Team Name Input */}
        <div className="mb-8">
          <label className="block text-lg mb-2">Team Name:</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your team name..."
          />
        </div>
  
        {/* Search Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔍 Search and Add Players</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
  
          {/* Search Results */}
          <div className="space-y-4">
            {searchResults.map((player, index) => (
              <div
                key={index}
                className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center shadow hover:bg-neutral-700 transition"
              >
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-gray-400 text-sm">{player.team || "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"}, APG: {player.apg ?? "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleAddPlayer(player)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
                >
                  ➕ Add
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Selected Players */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🏀 Selected Players ({selectedPlayers.length}/5)</h2>
          <ul className="space-y-4">
            {selectedPlayers.map((player, index) => (
              <li
                key={index}
                className="bg-neutral-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between shadow"
              >
                <div className="mb-4 md:mb-0">
                  <p className="font-semibold">{player.name}</p>
                  <div className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                    <span>Position:</span>
                    <select
                      value={player.position || ""}
                      onChange={(e) => handleChangePosition(index, e.target.value)}
                      className="bg-neutral-700 border border-neutral-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select position</option>
                      <option value="PG">PG</option>
                      <option value="SG">SG</option>
                      <option value="SF">SF</option>
                      <option value="PF">PF</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
  
          {/* Save Changes Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleSaveChanges}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}
