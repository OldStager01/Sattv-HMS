//*Model Imports
const { appointmentModel, userStatusModel } = require("../../../model");

//*Service Imports
//Sheet Imports
const {
  addSheetRow,
  getSheetData,
  updateRowById,
} = require("../../sheets/sheetServices");
const addDiffHeaders = require("../../sheets/addDiffHeaders");

//Drive Imports
const uploadFiles = require("../../drive/uploadFiles");

//Calendar Imports
const { deleteEvent } = require("../../calendar/calenderServices");

//Config Imports
const config = require("../../../config/config");

//Utils Imports
const { getDate, transferObject } = require("../../../utils");

//User Imports
const { getUserFilesById, createUserEvent, getUserData } = require("../index");

//*Function
const newAppointment = async (
  id, //String
  data, //Object
  files = [] //Array of files
) => {
  //Get the valid keys from the model and transfer the data
  const appointmentData = transferObject(data, Object.keys(appointmentModel()));
  try {
    //Add Dates to the appointmentData
    const nowDate = (await getDate()).date;
    appointmentData.appointmentDate = nowDate.toString();

    //Check if the next appointment date exists and is greater than today's date
    let nextAppointmentDate = data.nextAppointmentDate;
    nextAppointmentDate = nextAppointmentDate && new Date(nextAppointmentDate);

    if (
      nextAppointmentDate &&
      nowDate.getTime() > nextAppointmentDate.getTime()
    ) {
      throw new Error(
        "Next appointment date should be greater than today's date"
      );
    }

    //Generate and add the appointmentId
    appointmentData.appointmentId = `A${nowDate.getTime()}`;

    //Get the user file and folder
    const { userFile, userFolder } = await getUserFilesById(id);
    const user = await getUserData(id, true);

    //Add the appointmentData to the user sheet
    await addDiffHeaders(
      userFile.id,
      config.appointmentSheetTitle,
      Object.keys(appointmentModel())
    );
    await addSheetRow(
      userFile.id,
      config.appointmentSheetTitle,
      appointmentData
    );

    //Add files if any
    if (files.length > 0) {
      await uploadFiles(files, userFolder[0].id);
    }

    //Create a google calender event
    //!Make changes to fields if required
    let eventId = "";
    if (nextAppointmentDate) {
      const event = {
        start: nextAppointmentDate,
      };
      if (user.email) {
        event.attendees = [user.email];
      }
      const response = await createUserEvent(event);
      eventId = response.data.id;
    }

    //Update the index sheet with next and last appointment date
    const updateData = {
      status: userStatusModel.active,
      eventId,
      nextAppointmentDate: nextAppointmentDate?.toString(),
      lastAppointmentDate: appointmentData.appointmentDate,
    };
    await addDiffHeaders(
      config.indexSheetId,
      config.indexSheetTitle,
      Object.keys(updateData)
    );

    //Delete the previous event
    const indexData = await getSheetData(
      config.indexSheetId,
      config.indexSheetTitle
    );
    const prevEventId = indexData.find((data) => data.id === id)?.eventId;
    if (prevEventId) {
      console.log("prevEventId", prevEventId);
      await deleteEvent(config.calendarName, prevEventId);
    }
    await updateRowById(
      config.indexSheetId,
      config.indexSheetTitle,
      id,
      updateData
    );
  } catch (error) {
    console.error("New Appointment :: newAppointment :: error", error);
    throw error;
  }
};
module.exports = newAppointment;
