 import React from "react";

// Component to display a list of users enrolled in a class
const ClassUserList = ({ users }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {/* Display username and email of each user */}
          {user.get("username")} – {user.get("email")}
        </li>
      ))}
    </ul>
  );
};

export default ClassUserList;
