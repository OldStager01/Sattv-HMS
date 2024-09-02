//*Config Imports
const config = require("../../../config/config");

//*Calendar Imports
const { patchEvent } = require("../../calendar/calenderServices");

//*Utils Imports
const { getDate } = require("../../../utils");

//*Sheet Imports
const { getSheetData, updateRowById } = require("../../sheets/sheetServices");

//*Function
const updateUserAppointment = async (
  id, //String
  {
    title, //String
    description, //String
    start, //Date Object
    end, //Date Object
    attendees, //Comma separated string
  }
) => {
  try {
    //Check if fields are empty
    if (!id) {
      throw new Error("Id is required");
    }
    if (!title && !description && !start && !end && !attendees) {
      throw new Error("At least one field is required");
    }

    //*Update the event in the calender
    //Get the index data
    const indexData = await getSheetData(
      config.indexSheetId,
      config.indexSheetTitle
    );
    // Get the calendar config from the index sheet
    const response = await getSheetData(
      config.indexSheetId,
      config.calendarSheetTitle
    );
    const calendarConfig = response[0];

    //Find the index of the id
    const index = indexData.findIndex((row) => row.id === id);
    if (index === -1) {
      throw new Error("Id not found");
    }
    const { eventId } = indexData[index];
    if (!eventId) {
      throw new Error("Event not found");
    }
    //Get the timezone
    const { timeZone } = await getDate();
    //Create the event object with the fields that are not empty
    const event = {};
    if (title) event.summary = title;
    if (description) event.description = description;
    if (start && !isNaN(Date.parse(start))) {
      event.start = {
        dateTime: start.toISOString(),
        timeZone: timeZone,
      };
      event.end = {
        dateTime: new Date(
          start.getTime() + Number(calendarConfig.duration) * 60000
        ).toISOString(),
        timeZone: timeZone,
      };
      updateRowById(config.indexSheetId, config.indexSheetTitle, id, {
        nextAppointmentDate: start.toString(),
      });
    }
    // if (end && !isNaN(Date.parse(end)))
    //   event.end = {
    //     dateTime: end.toISOString(),
    //     timeZone: timeZone,
    //   };
    if (attendees) {
      event.attendees = attendees.split(",").map((attendee) => {
        return { email: attendee.trim() };
      });
    }
    console.log("Event", event);
    await patchEvent(config.calendarName, eventId, event);
  } catch (error) {
    console.error("User Services :: updateUserEvent :: error: ", error);
    throw error;
  }
};
module.exports = updateUserAppointment;
