import React, { useState, useEffect } from "react";
import { createClass, getAllClasses, updateClass, removeClass } from "../../Common/Services/ClassService";
import { getAllUsers } from "../../Common/Services/UserService";
import ClassList from "./ClassList";
import ClassUserList from "./ClassUserList"; // new stateless child for displaying users
import { Link } from "react-router-dom";

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [updateId, setUpdateId] = useState(null);
  
  // State to handle showing users for a specific class
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedClassUsers, setSelectedClassUsers] = useState([]);

  const fetchClasses = () => {
    getAllClasses().then((results) => setClasses(results));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateOrUpdate = () => {
    if (!updateId) {
      createClass(name).then(() => {
        setName("");
        fetchClasses();
      });
    } else {
      updateClass(updateId, { name }).then(() => {
        setName("");
        setUpdateId(null);
        fetchClasses();
      });
    }
  };

  const handleDelete = (id) => {
    removeClass(id).then(() => {
      fetchClasses();
      // If the currently shown user list belongs to this class, hide it.
      if (selectedClassId === id) {
        setSelectedClassId(null);
        setSelectedClassUsers([]);
      }
    });
  };

  const handleEdit = (classObj) => {
    setUpdateId(classObj.id);
    setName(classObj.get("name"));
  };

  // New: fetch users for a specific class
  const handleShowUsers = (classObj) => {
    getAllUsers(classObj.id).then((users) => {
      setSelectedClassId(classObj.id);
      setSelectedClassUsers(users);
    });
  };

  const handleHideUsers = () => {
    setSelectedClassId(null);
    setSelectedClassUsers([]);
  };

  return (
    <div>
      <h2>Class Management</h2>
      <div>
        <input
          type="text"
          placeholder="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreateOrUpdate}>
          {updateId ? "Update Class" : "Create Class"}
        </button>
      </div>
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
          <button onClick={handleHideUsers}>Hide Users</button>
        </div>
      )}
      
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default ClassPage;
