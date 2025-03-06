import React, { useState, useEffect } from "react";
import { createUser, getAllUsers, updateUser, removeUser } from "../../Common/Services/UserService";
import { getAllClasses } from "../../Common/Services/ClassService";
import UserList from "./UserList";
import { Link } from "react-router-dom";

const UserPage = () => {
  // State to store the list of users
  const [users, setUsers] = useState([]);
  // State to store the list of available classes
  const [classes, setClasses] = useState([]);
  // State variables for user input fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  // Stores the ID of the user being updated (if any)
  const [updateId, setUpdateId] = useState(null);

  // Fetch users based on the selected class
  const fetchUsers = () => {
    getAllUsers(classId).then((results) => {
      setUsers(results);
    });
  };

  // Fetch all available classes
  const fetchClasses = () => {
    getAllClasses().then((results) => {
      setClasses(results);
    });
  };

  // Fetch classes when the component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch users whenever the selected class changes
  useEffect(() => {
    fetchUsers();
  }, [classId]);

  // Handles both user creation and updating
  const handleCreateOrUpdate = () => {
    if (!updateId) {
      // Creating a new user with the provided details
      createUser(username, email, classId).then(() => {
        // Reset input fields after creation
        setUsername("");
        setEmail("");
        fetchUsers(); // Refresh the user list
      });
    } else {
      // Updating an existing user with the selected ID
      updateUser(updateId, {
        username,
        email,
        class: { __type: "Pointer", className: "Class", objectId: classId },
      }).then(() => {
        // Reset input fields after update
        setUsername("");
        setEmail("");
        setUpdateId(null);
        fetchUsers(); // Refresh the user list
      });
    }
  };

  // Handles deleting a user by ID
  const handleDelete = (id) => {
    removeUser(id).then(() => {
      fetchUsers(); // Refresh the user list after deletion
    });
  };

  // Populates the input fields with the user's data for editing
  const handleEdit = (user) => {
    setUpdateId(user.id);
    setUsername(user.get("username"));
    setEmail(user.get("email"));
    if (user.get("class")) {
      setClassId(user.get("class").id);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <div>
        {/* Input fields for user details */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Dropdown for selecting a class */}
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.get("name")}
            </option>
          ))}
        </select>
        {/* Button for creating/updating a user */}
        <button onClick={handleCreateOrUpdate}>
          {updateId ? "Update User" : "Create User"}
        </button>
      </div>
      {/* User list component for displaying users */}
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {/* Navigation link to return to the home page */}
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default UserPage;
