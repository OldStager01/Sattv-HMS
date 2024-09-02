//Config Imports
const config = require("../../../config/config");

//Model Imports
const {
  indexModel,
  userModel,
  appointmentModel,
  userStatusModel,
} = require("../../../model");

//Utils Imports
const { getDate, transferObject } = require("../../../utils");

//Sheet Imports
const {
  addSheetRow,
  createDoc,
  addSheetToBook,
  deleteSheet,
} = require("../../sheets/sheetServices");
const addDiffHeaders = require("../../sheets/addDiffHeaders");

//Drive Imports
const {
  createFolder,
  moveFile,
  addDescription,
} = require("../../drive/crudDrive");
const uploadFiles = require("../../drive/uploadFiles");

//*Function
const register = async (userData) => {
  try {
    //TODO: ADD function to check if user already exists

    //Generating a unique id for the user
    const initials = userData.firstName[0] + userData.lastName[0];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const day = (await getDate()).date.getDate();
    const id = `${initials}${randomNumber}${day}`;

    //Add Dates to the userData
    userData.createdAt = (await getDate()).date.toString();

    if (!isNaN(Date.parse(userData.dob))) {
      userData.dob = new Date(userData.dob).toLocaleDateString();
    }

    //!Drive:
    //Create a user folder in drive
    const folderId = await createFolder(id, config.driveFolderId);
    await addDescription(
      folderId,
      `username: ${userData.firstName} ${userData.lastName}`
    );

    //!Sheet
    //Create a user doc in drive
    const docId = await createDoc(id);
    await addDescription(
      docId,
      `username: ${userData.firstName} ${userData.lastName}`
    );

    //Move sheet to the folder
    await moveFile(docId, folderId);

    //Upload files to the folder
    if (userData.files.length > 0) {
      await uploadFiles(userData.files, folderId);
    }
    //Remove files from userData
    delete userData.files;

    //Set the user status as active
    userData.status = userStatusModel.new;

    //Update the userData with id, folderId and docId
    userData = { id, folderId, docId, ...userData };

    //!Sheets
    //Define the header row of user sheet
    const userHeaderRow = Object.keys(userModel());
    const appointmentHeaderRow = Object.keys(appointmentModel());

    //Create a new user and appointment sheet in user doc and add the header row
    await addSheetToBook(docId, config.userSheetTitle, userHeaderRow);
    await addSheetToBook(
      docId,
      config.appointmentSheetTitle,
      appointmentHeaderRow
    );

    //!Index Sheet
    //Get the index sheet header row from the index model as an array
    const indexHeaderRow = Object.keys(indexModel());
    //Add the uncommon fields to the index sheet header row
    await addDiffHeaders(
      config.indexSheetId,
      config.indexSheetTitle,
      indexHeaderRow
    );
    //Get the common fields to add to the index sheet
    const indexFieldsData = transferObject(userData, indexHeaderRow);
    //Add user to the index sheet
    await addSheetRow(
      config.indexSheetId,
      config.indexSheetTitle,
      indexFieldsData
    );

    //!User Sheet
    //Get the common fields to add to the user sheet
    const userFieldsData = transferObject(userData, userHeaderRow);
    //Add the common fields to the user sheet header row
    await addDiffHeaders(docId, config.userSheetTitle, userHeaderRow);
    //Add user to the user sheet
    await addSheetRow(docId, config.userSheetTitle, userFieldsData);

    //!Appointment Sheet
    //Add the common fields to the appointment sheet
    const appointmentFieldsData = transferObject(
      userData,
      appointmentHeaderRow
    );
    appointmentFieldsData.appointmentId = 0;
    //Add the common fields to the appointment sheet header row
    await addDiffHeaders(
      docId,
      config.appointmentSheetTitle,
      appointmentHeaderRow
    );
    //Add user to the appointment sheet
    await addSheetRow(
      docId,
      config.appointmentSheetTitle,
      appointmentFieldsData
    );

    //Delete the default sheet (Sheet1)
    await deleteSheet(docId, "Sheet1");
  } catch (error) {
    console.error("User Service :: register :: Error :: ", error);
    throw new Error("Error registering user.");
  }
};

module.exports = register;
