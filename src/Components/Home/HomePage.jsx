// src/Components/Home/HomePage.jsx
import React from "react";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Yoga Sign-Up Platform</h1>
      <ul>
        <li><a href="/users">Manage Users</a></li>
        <li><a href="/classes">Manage Classes</a></li>
      </ul>
    </div>
  );
}