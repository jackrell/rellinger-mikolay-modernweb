// src/Common/Services/ViewService.js

import Parse from "parse";

/* SERVICE FOR PARSE SERVER OPERATIONS FOR VIEWING TEAMS */

// Get all teams (including createdBy user info)
export const getAllTeams = () => {
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  query.include("createdBy"); // ← Include the full user pointer
  return query.find().then((results) => {
    return results;
  });
};

// Optionally filter teams by team name or other fields
export const searchTeamsByName = (nameQuery) => {
  const Team = Parse.Object.extend("Team");
  const query = new Parse.Query(Team);
  query.matches("name", nameQuery, "i"); // case-insensitive partial match
  query.include("createdBy"); // ← Make sure createdBy is included in search too
  return query.find().then((results) => {
    return results;
  });
};
