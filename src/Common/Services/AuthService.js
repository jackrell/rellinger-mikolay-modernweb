// src/Common/Services/AuthService.js

import Parse from "parse";

// SIGN UP
export const signUp = async (username, email, password) => {
  const user = new Parse.User();
  user.set("username", username);
  user.set("email", email);
  user.set("password", password);

  try {
    await user.signUp();
    return user;
  } catch (error) {
    throw error;
  }
};

// LOGIN
export const logIn = async (username, password) => {
  try {
    const user = await Parse.User.logIn(username, password);
    return user;
  } catch (error) {
    throw error;
  }
};

// LOGOUT
export const logOut = async () => {
  try {
    await Parse.User.logOut();
  } catch (error) {
    throw error;
  }
};

// GET CURRENT USER
export const getCurrentUser = () => {
  return Parse.User.current();
};
