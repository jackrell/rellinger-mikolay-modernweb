import Parse from "parse";

/* SERVICE FOR PARSE SERVER OPERATIONS FOR CLASS */

// CREATE operation – new class with name
export const createClass = (name) => {
  console.log("Creating class: ", name);
  const Class = Parse.Object.extend("Class");
  const classObj = new Class();
  classObj.set("name", name);
  return classObj.save().then((result) => {
    // returns new Class object
    return result;
  });
};

// READ operation – get class by ID
export const getClassById = (id) => {
  const Class = Parse.Object.extend("Class");
  const query = new Parse.Query(Class);
  return query.get(id).then((result) => {
    return result;
  });
};

// READ operation – get all classes
export const getAllClasses = () => {
  const Class = Parse.Object.extend("Class");
  const query = new Parse.Query(Class);
  return query.find().then((results) => {
    return results;
  });
};

// UPDATE operation – update class by ID
export const updateClass = (id, updatedFields) => {
  const Class = Parse.Object.extend("Class");
  const query = new Parse.Query(Class);
  return query.get(id).then((classObj) => {
    Object.keys(updatedFields).forEach((field) => {
      classObj.set(field, updatedFields[field]);
    });
    return classObj.save();
  });
};

// DELETE operation – remove class by ID
export const removeClass = (id) => {
  const Class = Parse.Object.extend("Class");
  const query = new Parse.Query(Class);
  return query.get(id).then((classObj) => {
    return classObj.destroy();
  });
};
