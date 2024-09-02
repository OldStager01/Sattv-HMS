//Config Imports
const config = require("../../config/config");

//Sheet Imports
const { getSheetData } = require("../sheets/sheetServices");

//*Function
const verifyUser = async (id) => {
  // Get the users data from the sheet
  const users = await getSheetData(config.indexSheetId, config.indexSheetTitle);

  // Check if users data is empty
  const user = users.find((user) => user.id === id);

  // Return true if user exists else false
  if (user) {
    return true;
  } else {
    return false;
  }
};
module.exports = verifyUser;
