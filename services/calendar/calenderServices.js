//Authemtication Imports
const { getOAuth2Client } = require("../../config/googleServiceAuth");

//Google Imports
const { google } = require("googleapis");

//Utils Imports
const { getDate } = require("../../utils");

//Validation of Event Imports
const isValidEvent = require("./validateEvent");

//Function to get the calender
const getCalender = () => {
  try {
    return google.calendar({
      version: "v3",
      auth: getOAuth2Client(),
    });
  } catch (error) {
    console.error("Calender Services :: getCalender :: error: ", error);
    throw error;
  }
};

//Function to get the calenders list
const getCalenders = async () => {
  try {
    const calendar = getCalender();
    const response = await calendar.calendarList.list();
    const calendars = response.data.items;
    return calendars;
  } catch (error) {
    console.error("Calender Services :: getCalenders :: error: ", error);
    throw error;
  }
};

//Function to get the calender id by name
const getIdByName = async (name) => {
  try {
    if (!name) {
      throw new Error("Name is required");
    }
    const calendars = await getCalenders();
    const calendar = calendars.find(
      (calendar) => calendar?.summary === name
    )?.id;
    return calendar;
  } catch (error) {
    console.error("Calender Services :: getIdByName :: error: ", error);
    throw error;
  }
};

//Function to list the events
const listEvents = async (calendarName, maxResults = 10) => {
  try {
    if (!calendarName) {
      throw new Error("Calendar name is required");
    }
    const calendarId = await getIdByName(calendarName);
    if (!calendarId) {
      throw new Error("Calendar not found");
    }
    const calendar = getCalender();
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: (await getDate()).date.toISOString(),
      maxResults: maxResults ? maxResults : 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = response?.data?.items;
    return events;
  } catch (error) {
    console.error("Calender Services :: listEvents :: error: ", error);
    throw error;
  }
};

//Function to create an event
const createEvent = async (calendarName, event) => {
  try {
    if (!isValidEvent(event)) {
      throw new Error("Invalid event object");
    }
    if (!calendarName) {
      throw new Error("Calendar name is required");
    }
    if (!event) {
      throw new Error("Event is required");
    }
    const calendarId = await getIdByName(calendarName);
    if (!calendarId) {
      throw new Error("Calendar not found");
    }
    const calendar = getCalender();
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });
    return response;
  } catch (error) {
    console.error("Calender Services :: createEvent :: error: ", error);
    throw error;
  }
};

//Function to delete an event
const deleteEvent = async (calendarName, eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event Id is required");
    }
    if (!calendarName) {
      throw new Error("Calendar name is required");
    }
    const calendarId = await getIdByName(calendarName);
    if (!calendarId) {
      throw new Error("Calendar not found");
    }
    const calendar = getCalender();
    const response = await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });
    return response;
  } catch (error) {
    console.error("Calender Services :: deleteEvent :: error: ", error);
    throw error;
  }
};

//Function to patch an event
const patchEvent = async (calendarName, eventId, event) => {
  try {
    if (!isValidEvent(event)) {
      throw new Error("Invalid patch event object");
    }
    if (!eventId) {
      throw new Error("Event Id is required");
    }
    if (!calendarName) {
      throw new Error("Calendar name is required");
    }
    if (!event) {
      throw new Error("Patch Event is required");
    }
    const calendarId = await getIdByName(calendarName);
    if (!calendarId) {
      throw new Error("Calendar not found");
    }
    const calendar = getCalender();
    const response = await calendar.events.patch({
      calendarId: calendarId,
      eventId: eventId,
      requestBody: event,
    });
    return response;
  } catch (error) {
    console.error("Calender Services :: patchEvent :: error: ", error);
    throw error;
  }
};

module.exports = { listEvents, createEvent, deleteEvent, patchEvent };
