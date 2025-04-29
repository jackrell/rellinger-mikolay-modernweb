// src/Components/Manage/CreateTeam.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlayers } from "../../services/GetData";
import { createTeam } from "../../Common/Services/ManageService";
import Select from "react-select";
import players from "/src/assets/players.json";
import Court from "./Court";
import HomeButton from "../Common/HomeButton";

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1f2937", // Tailwind's bg-neutral-800
    borderColor: "#374151", // Tailwind's border-neutral-700
    color: "white",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
  }),
  option: (base, { isFocused }) => ({
    ...base,
    backgroundColor: isFocused ? "#374151" : "#1f2937",
    color: "white",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
};

// Default slot layout
const DEFAULT_SLOTS = [
  { id: "PG", label: "PG", x: 255, y: 250, player: null },
  { id: "SG", label: "SG", x: 110, y: 180, player: null },
  { id: "SF", label: "SF", x: 400, y: 190, player: null },
  { id: "PF", label: "PF", x: 150, y: 40, player: null },
  { id: "C", label: "C", x: 370, y: 40, player: null },
];

export default function CreateTeam() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    team: "",
    college: "",
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: "",
  });

  // Convert cm -> ft/inches
  function cmToFeetInches(cm) {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  }

  // Convert kg -> lbs
  function kgToLbs(kg) {
    return Math.round(kg * 2.20462);
  }

  // Options for filters
  const heightOptions = Array.from(
    new Set(players.map((p) => p.height).filter(Boolean))
  )
    .sort((a, b) => a - b)
    .map((cm) => ({ label: cmToFeetInches(cm), value: cm }));

  const weightOptions = Array.from(
    new Set(players.map((p) => p.weight).filter(Boolean))
  )
    .map((kg) => kgToLbs(kg))
    .sort((a, b) => a - b)
    .map((lbs) => ({ label: `${lbs} lbs`, value: lbs }));

  const nbaTeams = [
    { label: "Atlanta Hawks", value: "ATL" },
    { label: "Boston Celtics", value: "BOS" },
    { label: "Brooklyn Nets", value: "BKN" },
    { label: "Charlotte Hornets", value: "CHA" },
    { label: "Chicago Bulls", value: "CHI" },
    { label: "Cleveland Cavaliers", value: "CLE" },
    { label: "Dallas Mavericks", value: "DAL" },
    { label: "Denver Nuggets", value: "DEN" },
    { label: "Detroit Pistons", value: "DET" },
    { label: "Golden State Warriors", value: "GSW" },
    { label: "Houston Rockets", value: "HOU" },
    { label: "Indiana Pacers", value: "IND" },
    { label: "LA Clippers", value: "LAC" },
    { label: "Los Angeles Lakers", value: "LAL" },
    { label: "Memphis Grizzlies", value: "MEM" },
    { label: "Miami Heat", value: "MIA" },
    { label: "Milwaukee Bucks", value: "MIL" },
    { label: "Minnesota Timberwolves", value: "MIN" },
    { label: "New Orleans Pelicans", value: "NOP" },
    { label: "New York Knicks", value: "NYK" },
    { label: "Oklahoma City Thunder", value: "OKC" },
    { label: "Orlando Magic", value: "ORL" },
    { label: "Philadelphia 76ers", value: "PHI" },
    { label: "Phoenix Suns", value: "PHX" },
    { label: "Portland Trail Blazers", value: "POR" },
    { label: "Sacramento Kings", value: "SAC" },
    { label: "San Antonio Spurs", value: "SAS" },
    { label: "Toronto Raptors", value: "TOR" },
    { label: "Utah Jazz", value: "UTA" },
    { label: "Washington Wizards", value: "WAS" },
  ];

  const collegeOptions = Array.from(
    new Set(players.map((p) => p.college).filter(Boolean))
  )
    .sort()
    .map((college) => ({ label: college, value: college }));

  // search handler and filtering
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchPlayers(searchQuery);

      const filtered = results.filter((player) => {
        const height = player.height || null;
        const weight = player.weight ? kgToLbs(player.weight) : null;

        const matchesTeam = filters.team === "" || player.team === filters.team;
        const matchesCollege =
          filters.college === "" || player.college === filters.college;
        const matchesHeightMin =
          !filters.minHeight ||
          (height && height >= parseFloat(filters.minHeight));
        const matchesHeightMax =
          !filters.maxHeight ||
          (height && height <= parseFloat(filters.maxHeight));
        const matchesWeightMin =
          !filters.minWeight ||
          (weight && weight >= parseInt(filters.minWeight));
        const matchesWeightMax =
          !filters.maxWeight ||
          (weight && weight <= parseInt(filters.maxWeight));

        return (
          matchesTeam &&
          matchesCollege &&
          matchesHeightMin &&
          matchesHeightMax &&
          matchesWeightMin &&
          matchesWeightMax
        );
      });

      setSearchResults(filtered.slice(0, 10));
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // handles adding a player to the selected players array
  const handleAddPlayer = (player) => {
    if (
      selectedPlayers.length < 5 &&
      !selectedPlayers.find((p) => p.name === player.name)
    ) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // handles removing a player from selected players array
  const handleRemovePlayer = (playerName) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.name !== playerName));
    setSlots((prev) =>
      prev.map((slot) =>
        slot.player?.name === playerName ? { ...slot, player: null } : slot
      )
    );
  };

  // handles saving the team using our createTeam service
  const handleSaveTeam = async () => {
    if (!teamName || slots.some((slot) => !slot.player)) {
      alert("Please enter a team name and assign a player to each position.");
      return;
    }
    try {
      const playersWithPositions = slots.map((slot) => ({
        ...slot.player,
        position: slot.id,
      }));
      await createTeam(teamName, playersWithPositions);
      navigate("/manage-teams");
    } catch (err) {
      console.error("Error saving team:", err);
      alert("Failed to save team.");
    }
  };

  // logic for saving team
  const isSaveDisabled =
    selectedPlayers.length !== 5 || slots.some((slot) => !slot.player);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 relative">
      <HomeButton />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">➕ Create a New Team</h1>

        {/* Team Name */}
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

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left column: Search + Filters + Selected Players */}
          <div>
            {/* Search */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                🔍 Search and Filter Players
              </h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                  placeholder="Search player by name..."
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Select
                  options={nbaTeams}
                  placeholder="Select NBA team"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      team: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />

                <Select
                  options={collegeOptions}
                  placeholder="Select college"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      college: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />

                <Select
                  options={heightOptions}
                  placeholder="Min height"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      minHeight: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />

                <Select
                  options={heightOptions}
                  placeholder="Max height"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxHeight: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />

                <Select
                  options={weightOptions}
                  placeholder="Min weight"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      minWeight: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />

                <Select
                  options={weightOptions}
                  placeholder="Max weight"
                  onChange={(selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxWeight: selected?.value || "",
                    }))
                  }
                  isClearable
                  styles={customSelectStyles}
                />
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
                      <p className="text-gray-400 text-sm">
                        {player.team || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"},
                        APG: {player.apg ?? "N/A"}
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
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                🏀 Selected Players ({selectedPlayers.length}/5)
              </h2>
              <ul className="space-y-4">
                {selectedPlayers.map((player, index) => {
                  const assignedSlot = slots.find(
                    (slot) => slot.player?.name === player.name
                  );
                  return (
                    <li
                      key={index}
                      className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center shadow hover:bg-neutral-700 transition"
                    >
                      <div>
                        <p className="font-semibold">
                          {player.name}{" "}
                          <span className="text-gray-400 text-sm">
                            {assignedSlot
                              ? `(${assignedSlot.id})`
                              : "(unassigned)"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PPG: {player.ppg ?? "N/A"}, RPG: {player.rpg ?? "N/A"}
                          , APG: {player.apg ?? "N/A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(player.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right column: Court */}
          {/* Right column: Court */}
          <div className="flex flex-col items-center">
            {/* Title + Court tightly wrapped together */}
            <div className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-semibold">Assign Positions</h2>
              <Court
                slots={slots}
                setSlots={setSlots}
                selectedPlayers={selectedPlayers}
              />
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={handleSaveTeam}
            disabled={isSaveDisabled}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition ${
              isSaveDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            💾 Save Team
          </button>
          <button
            onClick={() => navigate("/manage-teams")}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
