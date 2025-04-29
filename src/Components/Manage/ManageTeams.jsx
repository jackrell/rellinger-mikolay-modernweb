// src/Components/Manage/ManageTeams.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTeamsByCurrentUser,
  removeTeam,
} from "../../Common/Services/ManageService";
import HomeButton from "../Common/HomeButton";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  // gets and sets teams
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

  // handles the deletion of teams
  const handleDelete = async (teamId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this team?");
    if (!confirmDelete) return;

    try {
      await removeTeam(teamId);
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (err) {
      console.error("Error deleting team:", err);
      alert("Failed to delete team.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 relative">
      <HomeButton />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage My Teams</h1>

        {teams.length === 0 ? (
          <p className="text-gray-400 text-center mb-12">
            You haven't created any teams yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-neutral-800 rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <h2 className="text-xl font-semibold mb-4">{team.get("name")}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/edit-team/${team.id}`)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team button below grid of teams */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/create-team")}
            className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-lg"
          >
            ➕ Create New Team
          </button>
        </div>
      </div>
    </div>
  );
}
