import React from "react";

const ClassUserList = ({ users }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.get("username")} – {user.get("email")}
        </li>
      ))}
    </ul>
  );
};

export default ClassUserList;
