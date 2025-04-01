// src/Components/Manage/ManageTeams.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTeamsByCurrentUser,
  removeTeam
} from "../../Common/Services/ManageService";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]); // Local state to store user's teams
  const navigate = useNavigate(); // React Router navigation hook

  // Fetch the teams created by the currently logged-in user when the component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const results = await getTeamsByCurrentUser();
        setTeams(results);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  // Handler for deleting a team
  const handleDelete = async (teamId) => {
    const confirm = window.confirm("Are you sure you want to delete this team?");
    if (!confirm) return;

    try {
      await removeTeam(teamId); // Delete from Parse
      setTeams((prev) => prev.filter((team) => team.id !== teamId)); // Update UI
    } catch (err) {
      console.error("Error deleting team:", err);
      alert("Failed to delete team.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠️ Manage My Teams</h2>

      {/* Button to create a new team */}
      <button
        onClick={() => navigate("/create-team")}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
      >
        ➕ Create New Team
      </button>

      {/* If no teams exist, show message. Otherwise, list each team with edit/delete options */}
      {teams.length === 0 ? (
        <p>You haven't created any teams yet.</p>
      ) : (
        teams.map((team) => (
          <div
            key={team.id}
            style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
          >
            <h3>{team.get("name")}</h3>
            <button onClick={() => navigate(`/edit-team/${team.id}`)}>
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(team.id)}
              style={{ marginLeft: "0.5rem" }}
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
