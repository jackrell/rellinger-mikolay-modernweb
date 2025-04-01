// src/Components/Manage/CreateTeam.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlayers } from "../../services/GetData";
import { createTeam } from "../../Common/Services/ManageService";
import Select from "react-select";
import players from "../../../public/players.json";

export default function CreateTeam() {
  const navigate = useNavigate();

  // State for team name, player selections, search, filters, and loading state
  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    team: "",
    college: "",
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: ""
  });

  // Styling for dropdowns (Select)
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid black"
      }
    })
  };

  // Converts cm to feet/inches (e.g., 6'2")
  function cmToFeetInches(cm) {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  }

  // Converts kg to rounded lbs
  function kgToLbs(kg) {
    return Math.round(kg * 2.20462);
  }

  // Generate height options from player data
  const heightOptions = Array.from(
    new Set(players.map(p => p.height).filter(Boolean))
  )
    .sort((a, b) => a - b)
    .map(cm => ({
      label: cmToFeetInches(cm),
      value: cm
    }));

  // Generate weight options in lbs
  const weightOptions = Array.from(
    new Set(players.map(p => p.weight).filter(Boolean))
  )
    .map(kg => kgToLbs(kg))
    .sort((a, b) => a - b)
    .map(lbs => ({
      label: `${lbs} lbs`,
      value: lbs
    }));

  // NBA teams and abbreviations
  const nbaTeams = [
    { label: "Atlanta Hawks", value: "ATL" }, { label: "Boston Celtics", value: "BOS" },
    { label: "Brooklyn Nets", value: "BKN" }, { label: "Charlotte Hornets", value: "CHA" },
    { label: "Chicago Bulls", value: "CHI" }, { label: "Cleveland Cavaliers", value: "CLE" },
    { label: "Dallas Mavericks", value: "DAL" }, { label: "Denver Nuggets", value: "DEN" },
    { label: "Detroit Pistons", value: "DET" }, { label: "Golden State Warriors", value: "GSW" },
    { label: "Houston Rockets", value: "HOU" }, { label: "Indiana Pacers", value: "IND" },
    { label: "LA Clippers", value: "LAC" }, { label: "Los Angeles Lakers", value: "LAL" },
    { label: "Memphis Grizzlies", value: "MEM" }, { label: "Miami Heat", value: "MIA" },
    { label: "Milwaukee Bucks", value: "MIL" }, { label: "Minnesota Timberwolves", value: "MIN" },
    { label: "New Orleans Pelicans", value: "NOP" }, { label: "New York Knicks", value: "NYK" },
    { label: "Oklahoma City Thunder", value: "OKC" }, { label: "Orlando Magic", value: "ORL" },
    { label: "Philadelphia 76ers", value: "PHI" }, { label: "Phoenix Suns", value: "PHX" },
    { label: "Portland Trail Blazers", value: "POR" }, { label: "Sacramento Kings", value: "SAC" },
    { label: "San Antonio Spurs", value: "SAS" }, { label: "Toronto Raptors", value: "TOR" },
    { label: "Utah Jazz", value: "UTA" }, { label: "Washington Wizards", value: "WAS" }
  ];

  // Generate list of colleges from player data
  const uniqueColleges = Array.from(new Set(players.map(p => p.college).filter(Boolean))).sort();
  const collegeOptions = uniqueColleges.map(college => ({ label: college, value: college }));

  // Handle team name input change
  const handleTeamNameChange = (e) => setTeamName(e.target.value);

  // Handle search and apply filters to results
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchPlayers(searchQuery);

      const filtered = results.filter((player) => {
        const height = player.height || null;
        const weight = player.weight ? kgToLbs(player.weight) : null;

        const matchesTeam = filters.team === "" || player.team === filters.team;
        const matchesCollege = filters.college === "" || player.college === filters.college;
        const matchesHeightMin = !filters.minHeight || (height && height >= parseFloat(filters.minHeight));
        const matchesHeightMax = !filters.maxHeight || (height && height <= parseFloat(filters.maxHeight));
        const matchesWeightMin = !filters.minWeight || (weight && weight >= parseInt(filters.minWeight));
        const matchesWeightMax = !filters.maxWeight || (weight && weight <= parseInt(filters.maxWeight));

        return matchesTeam && matchesCollege && matchesHeightMin && matchesHeightMax && matchesWeightMin && matchesWeightMax;
      });

      setSearchResults(filtered.slice(0, 10));
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  // Add a player to selected list (if limit not exceeded)
  const handleAddPlayer = (player) => {
    if (selectedPlayers.length < 5 && !selectedPlayers.find(p => p.name === player.name)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Save team to Parse backend
  const handleSaveTeam = async () => {
    if (!teamName || selectedPlayers.length !== 5) {
      alert("Please enter a team name and select exactly 5 players.");
      return;
    }

    try {
      await createTeam(teamName, selectedPlayers);
      navigate("/manage-teams");
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>➕ Create a New NBA Team</h2>

      {/* Team name input */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={handleTeamNameChange}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          />
        </label>
      </div>

      {/* Player search and filters */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>🔍 Search and Filter Players</h3>
        
        {/* Search by player name */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.6rem",
            fontSize: "15.5px",
            fontFamily: "Serif",
            border: "1px solid black",
            borderRadius: "4px",
            height: "38px",
            width: "213px",
            boxSizing: "border-box",
            marginBottom: "1rem"
          }}
        />

        {/* Filter dropdowns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem"
        }}>
          <Select
            styles={customSelectStyles}
            options={nbaTeams}
            placeholder="Select a team..."
            value={nbaTeams.find(opt => opt.value === filters.team) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, team: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
          <Select
            styles={customSelectStyles}
            options={collegeOptions}
            placeholder="Select a college..."
            value={collegeOptions.find(opt => opt.value === filters.college) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, college: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
          <Select
            styles={customSelectStyles}
            options={heightOptions}
            placeholder="Min height"
            value={heightOptions.find(opt => opt.value === filters.minHeight) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, minHeight: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
          <Select
            styles={customSelectStyles}
            options={heightOptions}
            placeholder="Max height"
            value={heightOptions.find(opt => opt.value === filters.maxHeight) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, maxHeight: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
          <Select
            styles={customSelectStyles}
            options={weightOptions}
            placeholder="Min weight"
            value={weightOptions.find(opt => opt.value === filters.minWeight) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, minWeight: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
          <Select
            styles={customSelectStyles}
            options={weightOptions}
            placeholder="Max weight"
            value={weightOptions.find(opt => opt.value === filters.maxWeight) || null}
            onChange={(selected) =>
              setFilters(prev => ({ ...prev, maxWeight: selected ? selected.value : "" }))
            }
            isClearable
            isSearchable
          />
        </div>

        {/* Search button */}
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>

        {/* Display search results */}
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

      {/* Selected players + team save/cancel */}
      <div>
        <h3>🏀 Selected Players ({selectedPlayers.length}/5)</h3>
        <ul>
          {selectedPlayers.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={handleSaveTeam}
            style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
          >
            💾 Save Team
          </button>
          <button
            onClick={() => navigate("/manage-teams")}
            style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
