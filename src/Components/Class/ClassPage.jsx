import React, { useState, useEffect } from "react";
import { createClass, getAllClasses, updateClass, removeClass } from "../../Common/Services/ClassService";
import { getAllUsers } from "../../Common/Services/UserService";
import ClassList from "./ClassList";
import ClassUserList from "./ClassUserList"; // new stateless child for displaying users
import { Link } from "react-router-dom";

const ClassPage = () => {
  // State to store the list of classes
  const [classes, setClasses] = useState([]);
  // State to manage the class name input field
  const [name, setName] = useState("");
  // State to track if a class is being updated
  const [updateId, setUpdateId] = useState(null);
  
  // State to handle showing users for a specific class
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedClassUsers, setSelectedClassUsers] = useState([]);

  // Fetch all classes from the service
  const fetchClasses = () => {
    getAllClasses().then((results) => setClasses(results));
  };

  // useEffect to fetch classes when the component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Handles creation or updating of a class
  const handleCreateOrUpdate = () => {
    if (!updateId) {
      createClass(name).then(() => {
        setName("");
        fetchClasses(); // Refresh the class list
      });
    } else {
      updateClass(updateId, { name }).then(() => {
        setName("");
        setUpdateId(null);
        fetchClasses(); // Refresh the class list
      });
    }
  };

  // Handles class deletion
  const handleDelete = (id) => {
    removeClass(id).then(() => {
      fetchClasses(); // Refresh the class list
      // If the currently shown user list belongs to this class, hide it.
      if (selectedClassId === id) {
        setSelectedClassId(null);
        setSelectedClassUsers([]);
      }
    });
  };

  // Handles editing an existing class
  const handleEdit = (classObj) => {
    setUpdateId(classObj.id);
    setName(classObj.get("name")); // Prefill the input with the class name
  };

  // Fetch users for a specific class
  const handleShowUsers = (classObj) => {
    getAllUsers(classObj.id).then((users) => {
      setSelectedClassId(classObj.id);
      setSelectedClassUsers(users);
    });
  };

  // Hide the list of users when toggled
  const handleHideUsers = () => {
    setSelectedClassId(null);
    setSelectedClassUsers([]);
  };

  return (
    <div>
      <h2>Class Management</h2>
      <div>
        {/* Input field for class name */}
        <input
          type="text"
          placeholder="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* Button to create or update class */}
        <button onClick={handleCreateOrUpdate}>
          {updateId ? "Update Class" : "Create Class"}
        </button>
      </div>
      {/* Render the list of classes */}
      <ClassList
        classes={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShowUsers={handleShowUsers}
      />
      
      {/* Conditionally render the list of users for the selected class */}
      {selectedClassId && (
        <div>
          <h3>Users Signed Up for this Class</h3>
          <ClassUserList users={selectedClassUsers} />
          {/* Button to hide user list */}
          <button onClick={handleHideUsers}>Hide Users</button>
        </div>
      )}
      
      {/* Navigation link to return home */}
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default ClassPage;
