//Config Imports
const config = require("../../../config/config");

//Model Imports
const { userModel, indexModel } = require("../../../model");

//Utils Imports
const { transferObject } = require("../../../utils");

//Sheet Imports
const { updateRowById } = require("../../sheets/sheetServices");

//User Imports
const { getUserFilesById } = require("../index");

//*Function
const editUserProfile = async (id, data) => {
  try {
    //Create index and user objects with the common keys from the model
    if (data.id) {
      delete user.id;
    }
    console.log(data);
    const index = transferObject(data, Object.keys(indexModel()));
    const user = transferObject(data, Object.keys(userModel()));

    //Get the user file
    const { userFile } = await getUserFilesById(id);

    //Update index sheet
    await updateRowById(config.indexSheetId, config.indexSheetTitle, id, index);

    //Update user sheet
    await updateRowById(userFile.id, config.userSheetTitle, id, user);
  } catch (error) {
    console.error("User Services :: updateUser :: error :: ", error);
    throw error;
  }
};

module.exports = editUserProfile;
