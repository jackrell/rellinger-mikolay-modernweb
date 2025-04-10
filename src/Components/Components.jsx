// src/Components/Components.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing page components
import HomePage from "./Home/HomePage";
import ViewTeams from "./View/ViewTeams";
import TeamDetails from "./View/TeamDetails";
import ManageTeams from "./Manage/ManageTeams";
import EditTeam from "./Manage/EditTeam";
import CreateTeam from "./Manage/CreateTeam";
import PlayerProfile from "./View/PlayerProfile";
import Auth from "./Auth/Auth";
import SimulateGame from "./Simulate/GamePreview";

// Route protection and utility components
import ProtectedRoute from "../Common/ProtectedRoute";
import HomeButton from "./Common/HomeButton";

export default function Components() {
  return (
    <Router>
      {/* Persistent home button displayed on all pages except "/" */}
      <HomeButton />

      <Routes>
        {/* Public Routes - accessible to all users */}
        <Route path="/" element={<HomePage />} />
        <Route path="/view-teams" element={<ViewTeams />} />
        <Route path="/team/:teamId" element={<TeamDetails />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/simulate" element={<SimulateGame />} /> {/* ✅ NEW ROUTE */}

        {/* Protected Routes - only accessible to authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/manage-teams" element={<ManageTeams />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/edit-team/:teamId" element={<EditTeam />} />
        </Route>
      </Routes>
    </Router>
  );
}
