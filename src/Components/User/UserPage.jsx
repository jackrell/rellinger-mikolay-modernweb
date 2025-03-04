import React, { useState, useEffect } from "react";
import { createUser, getAllUsers, updateUser, removeUser } from "../../Common/Services/UserService";
import { getAllClasses } from "../../Common/Services/ClassService";
import UserList from "./UserList";
import { Link } from "react-router-dom";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [updateId, setUpdateId] = useState(null);

  const fetchUsers = () => {
    // If a class is selected, filter by that class; otherwise get all users.
    getAllUsers(classId).then((results) => {
      setUsers(results);
    });
  };

  const fetchClasses = () => {
    getAllClasses().then((results) => {
      setClasses(results);
    });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [classId]);

  const handleCreateOrUpdate = () => {
    if (!updateId) {
      createUser(username, email, classId).then(() => {
        setUsername("");
        setEmail("");
        fetchUsers();
      });
    } else {
      // For updating the user’s pointer, we pass the pointer data in the format Parse expects.
      updateUser(updateId, {
        username,
        email,
        class: { __type: "Pointer", className: "Class", objectId: classId },
      }).then(() => {
        setUsername("");
        setEmail("");
        setUpdateId(null);
        fetchUsers();
      });
    }
  };

  const handleDelete = (id) => {
    removeUser(id).then(() => {
      fetchUsers();
    });
  };

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
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.get("name")}
            </option>
          ))}
        </select>
        <button onClick={handleCreateOrUpdate}>
          {updateId ? "Update User" : "Create User"}
        </button>
      </div>
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default UserPage;
