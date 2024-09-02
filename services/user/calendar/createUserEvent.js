//Config Imports
const config = require("../../../config/config");
//Model Imports
const { eventModel } = require("../../../model");

//Utils Imports
const { getDate } = require("../../../utils");

//Sheet Imports
const { getSheetData } = require("../../sheets/sheetServices");

//Calendar Imports
const { createEvent } = require("../../calendar/calenderServices");

//*Function
const createUserEvent = async ({
  title, //String
  description, //String
  start, //Date object
  end, //Date object
  attendees, //Array of emails
}) => {
  try {
    // Get the calendar config from the index sheet
    const response = await getSheetData(
      config.indexSheetId,
      config.calendarSheetTitle
    );
    const calendarConfig = response[0];

    // Set the default values if not provided
    title = title ? title : calendarConfig.title;
    description = description ? description : calendarConfig.description;
    end = end
      ? end
      : new Date(start.getTime() + Number(calendarConfig.duration) * 60000);

    // Get time zone
    const { timeZone } = await getDate();

    //Format the attendees in format required by google calendar i.e. attendees=[{email: email}]
    attendees = attendees.map((email) => {
      return {
        email: email,
      };
    });
    // Create the event object
    const event = eventModel({
      ...calendarConfig,
      summary: title,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: timeZone,
      },
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, //!Change this later
          { method: "popup", minutes: 10 },
        ],
      },
    });
    // Create the event
    return await createEvent(config.calendarName, event);
  } catch (error) {
    console.error("Create User Event :: createUserEvent :: error ", error);
    throw new Error(error);
  }
};

module.exports = createUserEvent;
