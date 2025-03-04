import React from "react";

const ClassList = ({ classes, onEdit, onDelete, onShowUsers }) => {
  return (
    <ul>
      {classes.map((cls) => (
        <li key={cls.id}>
          <strong>{cls.get("name")}</strong>
          <button onClick={() => onEdit(cls)}>Edit</button>
          <button onClick={() => onDelete(cls.id)}>Delete</button>
          <button onClick={() => onShowUsers(cls)}>Show Users</button>
        </li>
      ))}
    </ul>
  );
};

export default ClassList;
