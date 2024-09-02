//Config Imports
const config = require("../../../config/config");

//Drive Imports
const { listFiles, listFolders } = require("../../drive/crudDrive");

//*Function
const getUserFilesById = async (id) => {
  try {
    // Get the user folder from the drive
    const userFolder = await listFolders(config.driveFolderId, id);
    //Check if user folder exists
    if (userFolder.length === 0) {
      throw new Error("User folder not found");
    } //Check if multiple folders exist
    else if (userFolder.length > 1) {
      throw new Error("Multiple folders found for user");
    }

    // Get the user folder
    const folderId = userFolder[0].id;

    // Get the user files from the drive
    const files = await listFiles(folderId);

    // Find and check if user file (spreadsheet) exists
    const userFileIndex = files.findIndex((file) => file.name === id);
    if (userFileIndex === -1) {
      throw new Error("User file not found");
    }
    const userFile = files[userFileIndex];

    // Remove user file from files array
    files.splice(userFileIndex, 1);

    // Return user file, user folder and files
    return {
      userFile,
      userFolder,
      files,
    };
  } catch (error) {
    console.error("User Service :: getUserFilesById :: Error :: ", error);
    throw error;
  }
};

module.exports = getUserFilesById;
