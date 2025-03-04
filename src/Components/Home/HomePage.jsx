// src/Components/Home/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Yoga Sign-Up Platform</h1>
      <ul>
        <li><Link to="/users">Manage Users</Link></li>
        <li><Link to="/classes">Manage Classes</Link></li>
      </ul>
    </div>
  );
}