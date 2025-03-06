import React from "react";

// Component to display a list of users with actions for editing and deleting
const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {/* Display username and email of each user */}
          <strong>{user.get("username")}</strong> – {user.get("email")}
          {/* Button to edit user details */}
          <button onClick={() => onEdit(user)}>Edit</button>
          {/* Button to delete the user */}
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
