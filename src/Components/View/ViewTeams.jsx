// src/Components/View/ViewTeams.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTeams } from "../../Common/Services/ViewService";

export default function ViewTeams() {
  const navigate = useNavigate(); // For routing to team details
  const [teams, setTeams] = useState([]); // Holds all teams from the backend
  const [searchValue, setSearchValue] = useState(""); // Search input for team name
  const [usernameSearch, setUsernameSearch] = useState(""); // Search input for creator username

  // Fetch all teams when component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const results = await getAllTeams(); // Call Parse service to get teams
        setTeams(results); // Store results in state
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  // Filter logic based on both team name and username inputs
  const filteredTeams = teams.filter((team) => {
    const teamName = team.get("name")?.toLowerCase() || "";
    const creatorUsername = team.get("createdByUsername")?.toLowerCase() || "";

    return (
      teamName.includes(searchValue.toLowerCase()) &&
      creatorUsername.includes(usernameSearch.toLowerCase())
    );
  });

  // Styling for search input boxes
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

      {/* Render filtered team list */}
      {filteredTeams.map((team) => {
        const username = team.get("createdByUsername") || "Unknown";

        return (
          <div
            key={team.id || team.objectId}
            style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
          >
            <h3>{team.get("name")}</h3>
            <p style={{ fontStyle: "italic", color: "#555" }}>Created by: {username}</p>
            <button onClick={() => navigate(`/team/${team.id || team.objectId}`)}>
              🔍 View Details
            </button>
          </div>
        );
      })}
    </div>
  );
}
