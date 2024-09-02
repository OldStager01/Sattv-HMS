//Config Imports
const config = require("../../../config/config.js");

//Sheet Imports
const { getSheetData } = require("../../sheets/sheetServices.js");

//User Imports
// const { getUserFilesById } = require("../index");
const getUserFilesById = require("./getUserFilesById");
//*Function
const getUserData = async (id, onlyUser = false) => {
  try {
    // Get the user folder from the drive
    const { files, userFile } = await getUserFilesById(id);
    // Check if the user file is found
    if (!userFile) {
      return null;
    }

    // Get the user data from the sheet
    const userData = await getSheetData(userFile.id, config.userSheetTitle);
    if (userData.length === 0) {
      return null;
    }

    // Return only the user data if onlyUser is true
    if (onlyUser) {
      return userData[0];
    }

    // Get the appointments data from the sheet
    const appointmentsData = await getSheetData(
      userFile.id,
      config.appointmentSheetTitle
    );
    // Create and return the user data object
    const userDataObject = {
      user: userData[0],
      appointments: appointmentsData,
      files,
    };
    return userDataObject;
  } catch (error) {
    console.error("User Service :: getUserData :: Error :: ", error);
    throw error;
  }
};

module.exports = getUserData;
