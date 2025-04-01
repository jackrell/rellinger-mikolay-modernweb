// src/Common/Services/ManageService.js

import Parse from "parse";

/* SERVICE FOR PARSE SERVER OPERATIONS FOR MANAGING TEAMS */

// CREATE operation – new team with name and array of player objects
export const createTeam = (name, players) => {
  const Team = Parse.Object.extend("Team");
  const team = new Team();

  const currentUser = Parse.User.current();

  team.set("name", name);
  team.set("players", players); // assuming players is an array of JSON objects

  if (currentUser) {
    team.set("createdBy", currentUser); // Save pointer
    team.set("createdByUsername", currentUser.get("username")); // Save string for public display
  }

  return team.save().then((result) => {
    return result;
  });
};

// READ operation – get a team by ID
export const getTeamById = (id) => {
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  query.include("createdBy"); // Keep including pointer for internal use
  return query.get(id).then((result) => {
    return result;
  });
};

// NEW: Get all teams created by the current user
export const getTeamsByCurrentUser = () => {
  const currentUser = Parse.User.current();
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  query.equalTo("createdBy", currentUser);
  return query.find();
};

// UPDATE operation – update team fields
export const updateTeam = (id, updatedFields) => {
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  return query.get(id).then((team) => {
    Object.keys(updatedFields).forEach((field) => {
      team.set(field, updatedFields[field]);
    });
    return team.save();
  });
};

// DELETE operation – remove team by ID
export const removeTeam = (id) => {
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  return query.get(id).then((team) => {
    return team.destroy();
  });
};
