// src/Components/Home/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

// Home page component providing navigation to different sections of the app
export default function HomePage() {
  return (
    <div>
      {/* Main heading of the homepage */}
      <h1>Welcome to the Yoga Sign-Up Platform</h1>
      <ul>
        {/* Navigation links to user and class management pages */}
        <li><Link to="/users">Manage Users</Link></li>
        <li><Link to="/classes">Manage Classes</Link></li>
      </ul>
    </div>
  );
}
