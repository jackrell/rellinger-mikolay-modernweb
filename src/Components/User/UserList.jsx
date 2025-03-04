import React from "react";

const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.get("username")}</strong> – {user.get("email")}
          <button onClick={() => onEdit(user)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;