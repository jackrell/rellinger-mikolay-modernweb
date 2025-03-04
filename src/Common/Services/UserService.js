import Parse from "parse";

/* SERVICE FOR PARSE SERVER OPERATIONS FOR USER */

// CREATE operation – new user with username, email, and a pointer to a Class
export const createUser = (username, email, classId) => {
  console.log("Creating user: ", username);
  const User = Parse.Object.extend("Users");
  const user = new User();
  user.set("username", username);
  user.set("email", email);
  if (classId) {
    const Class = Parse.Object.extend("Class");
    const classPointer = new Class();
    classPointer.set("objectId", classId);
    user.set("class", classPointer);
  }
  return user.save().then((result) => {
    // returns new User object
    return result;
  });
};

// READ operation – get user by ID
export const getUserById = (id) => {
  const User = Parse.Object.extend("Users");
  const query = new Parse.Query(User);
  return query.get(id).then((result) => {
    return result;
  });
};

// READ operation – get all users for a given class (or all if no classId)
export const getAllUsers = (classId) => {
  const User = Parse.Object.extend("Users");
  const query = new Parse.Query(User);
  if (classId) {
    const Class = Parse.Object.extend("Class");
    const classPointer = new Class();
    classPointer.set("objectId", classId);
    query.equalTo("class", classPointer);
  }
  return query.find().then((results) => {
    return results;
  });
};

// UPDATE operation – update user by ID
export const updateUser = (id, updatedFields) => {
  const User = Parse.Object.extend("Users");
  const query = new Parse.Query(User);
  return query.get(id).then((user) => {
    Object.keys(updatedFields).forEach((field) => {
      user.set(field, updatedFields[field]);
    });
    return user.save();
  });
};

// DELETE operation – remove user by ID
export const removeUser = (id) => {
  const User = Parse.Object.extend("Users");
  const query = new Parse.Query(User);
  return query.get(id).then((user) => {
    return user.destroy();
  });
};
