// src/Components/View/ViewTeams.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTeams } from "../../Common/Services/ViewService";

export default function ViewTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [simulateMode, setSimulateMode] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  // gets all teams and sets the teams array
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const results = await getAllTeams();
        setTeams(results);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  // for starting the simulation, the checkbox
  const handleCheckboxChange = (teamId) => {
    setSelectedTeamIds((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      } else if (prev.length < 2) {
        return [...prev, teamId];
      }
      return prev;
    });
  };

  // when we move on to simulate, can set the teams
  const handleContinue = () => {
    if (selectedTeamIds.length === 2) {
      const [id1, id2] = selectedTeamIds;
      const teamA = teams.find(
        (team) => team.id === id1 || team.objectId === id1
      );
      const teamB = teams.find(
        (team) => team.id === id2 || team.objectId === id2
      );

      if (teamA && teamB) {
        // Clean Parse objects into plain JS
        const cleanTeam = (team) => ({
          id: team.id || team.objectId,
          name: team.get("name"),
          players: team.get("players"),
          createdByUsername: team.get("createdByUsername"),
        });

        navigate("/simulate", {
          state: {
            teamA: cleanTeam(teamA),
            teamB: cleanTeam(teamB),
          },
        });
      }
    }
  };

  // filters deams based on search values
  const filteredTeams = teams.filter((team) => {
    const teamName = team.get("name")?.toLowerCase() || "";
    const creatorUsername = team.get("createdByUsername")?.toLowerCase() || "";

    return (
      teamName.includes(searchValue.toLowerCase()) &&
      creatorUsername.includes(usernameSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">View All Teams</h2>

        {/* Search Inputs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by team name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 min-w-[200px] p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Search by username"
            value={usernameSearch}
            onChange={(e) => setUsernameSearch(e.target.value)}
            className="flex-1 min-w-[200px] p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Simulate Mode Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              setSimulateMode(!simulateMode);
              setSelectedTeamIds([]);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              simulateMode
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            🎮 {simulateMode ? "Cancel Simulation" : "Simulate a Game"}
          </button>

          {simulateMode && (
            <button
              onClick={handleContinue}
              disabled={selectedTeamIds.length !== 2}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedTeamIds.length === 2
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              ✅ Continue
            </button>
          )}
        </div>

        {/* Team List */}
        <div className="space-y-6">
          {filteredTeams.map((team) => {
            const id = team.id || team.objectId;
            const username = team.get("createdByUsername") || "Unknown";

            return (
              <div
                key={id}
                className="bg-neutral-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {simulateMode && (
                    <input
                      type="checkbox"
                      checked={selectedTeamIds.includes(id)}
                      onChange={() => handleCheckboxChange(id)}
                      disabled={
                        !selectedTeamIds.includes(id) &&
                        selectedTeamIds.length >= 2
                      }
                      className="w-5 h-5 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {team.get("name")}
                    </h3>
                    <p className="text-gray-400 italic text-sm">
                      Created by: {username}
                    </p>
                  </div>
                </div>

                {!simulateMode && (
                  <button
                    onClick={() => navigate(`/team/${id}`)}
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
                  >
                    🔍 View Details
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
