//Config Imports
const config = require("../../../config/config.js");

//Util Imports
const { getDate } = require("../../../utils");

//Sheet Imports
const { getSheetData } = require("../../sheets/sheetServices.js");

//*Function
const listUsers = async ({ status = null, today = false }) => {
  try {
    // Get the users data from the sheet
    let users = await getSheetData(config.indexSheetId, config.indexSheetTitle);
    // Check if users data is empty
    if (users.length === 0) {
      return {};
    }
    //Total users
    const totalUsers = users.length;
    // Filter users by status
    if (!status == null) {
      users = users.filter((user) => user.status == status);
    }

    // Filter users by today's date
    if (today) {
      const { date } = await getDate();
      const results = await Promise.all(
        users.map((user) => {
          const nextAppointmentDate = new Date(user.nextAppointmentDate);
          return {
            user,
            isMatch: nextAppointmentDate.getDate() === date.getDate(),
          };
        })
      );
      users = results
        .filter((result) => result.isMatch)
        .map((result) => result.user);
    }
    // Return users
    return { users, totalUsers };
  } catch (error) {
    console.error("User Service :: listUsers :: Error :: ", error);
    throw new Error("Error getting users.");
  }
};

module.exports = listUsers;
