import React from "react";

// Component to display a list of classes with actions for editing, deleting, and viewing users
const ClassList = ({ classes, onEdit, onDelete, onShowUsers }) => {
  return (
    <ul>
      {classes.map((cls) => (
        <li key={cls.id}>
          {/* Display class name */}
          <strong>{cls.get("name")}</strong>
          {/* Button to edit the class */}
          <button onClick={() => onEdit(cls)}>Edit</button>
          {/* Button to delete the class */}
          <button onClick={() => onDelete(cls.id)}>Delete</button>
          {/* Button to view users signed up for this class */}
          <button onClick={() => onShowUsers(cls)}>Show Users</button>
        </li>
      ))}
    </ul>
  );
};

export default ClassList;
