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

  const handleContinue = () => {
    if (selectedTeamIds.length === 2) {
      const [id1, id2] = selectedTeamIds;
      const teamA = teams.find((team) => team.id === id1 || team.objectId === id1);
      const teamB = teams.find((team) => team.id === id2 || team.objectId === id2);

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

  const filteredTeams = teams.filter((team) => {
    const teamName = team.get("name")?.toLowerCase() || "";
    const creatorUsername = team.get("createdByUsername")?.toLowerCase() || "";

    return (
      teamName.includes(searchValue.toLowerCase()) &&
      creatorUsername.includes(usernameSearch.toLowerCase())
    );
  });

  const inputStyle = {
    padding: "0.6rem",
    fontSize: "15.5px",
    fontFamily: "Serif",
    border: "1px solid black",
    borderRadius: "4px",
    height: "38px",
    width: "213px",
    boxSizing: "border-box",
    marginBottom: "1rem"
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏀 View All Teams</h2>

      {/* Search Inputs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by team name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Search by username"
          value={usernameSearch}
          onChange={(e) => setUsernameSearch(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Simulate & Continue Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setSimulateMode(!simulateMode);
            setSelectedTeamIds([]);
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: simulateMode ? "#eee" : "#fff",
            border: "1px solid black",
            cursor: "pointer"
          }}
        >
          🎮 {simulateMode ? "Cancel Simulation" : "Simulate a Game"}
        </button>

        {simulateMode && (
          <button
            onClick={handleContinue}
            disabled={selectedTeamIds.length !== 2}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid black",
              backgroundColor: selectedTeamIds.length === 2 ? "#fff" : "#ccc",
              cursor: selectedTeamIds.length === 2 ? "pointer" : "not-allowed"
            }}
          >
            ✅ Continue
          </button>
        )}
      </div>

      {/* Team List */}
      {filteredTeams.map((team) => {
        const id = team.id || team.objectId;
        const username = team.get("createdByUsername") || "Unknown";

        return (
          <div
            key={id}
            style={{
              borderBottom: "1px solid #ccc",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            {simulateMode && (
              <input
                type="checkbox"
                checked={selectedTeamIds.includes(id)}
                onChange={() => handleCheckboxChange(id)}
                disabled={
                  !selectedTeamIds.includes(id) && selectedTeamIds.length >= 2
                }
              />
            )}
            <div>
              <h3>{team.get("name")}</h3>
              <p style={{ fontStyle: "italic", color: "#555" }}>
                Created by: {username}
              </p>
              {!simulateMode && (
                <button onClick={() => navigate(`/team/${id}`)}>
                  🔍 View Details
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
