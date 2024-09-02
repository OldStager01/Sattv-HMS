// const newAppointment = require("./appointment/newAppointment");
const updateUserAppointment = require("./appointment/updateUserAppointment");
const createUserEvent = require("./calendar/createUserEvent");
// const editUserProfile = require("./editUser/editUserProfile");
const getUserData = require("./getUser/getUserData");
const getUserFilesById = require("./getUser/getUserFilesById");
const listUsers = require("./getUser/listUsers");
const verifyUser = require("./verifyUser");
const register = require("./register/register");

module.exports = {
  updateUserAppointment,
  createUserEvent,
  getUserData,
  getUserFilesById,
  listUsers,
  verifyUser,
  register,
};
