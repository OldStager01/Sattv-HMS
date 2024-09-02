const { calendar } = require("googleapis/build/src/apis/calendar");

require("dotenv").config();

const config = {
  googleClientID: String(process.env.GOOGLE_CLIENT_ID),
  googleClientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
  sessionSecret: String(process.env.SESSION_SECRET),
  indexSheetId: String(process.env.INDEX_SHEET_ID),
  indexSheetTitle: String(process.env.INDEX_SHEET_TITLE),
  driveFolderId: String(process.env.DRIVE_ROOT_FOLDER_ID),
  userSheetTitle: String(process.env.USER_SHEET_TITLE),
  appointmentSheetTitle: String(process.env.APPOINTMENTS_SHEET_TITLE),
  calendarSheetTitle: String(process.env.CALENDAR_SHEET_TITLE),
  calendarName: String(process.env.CALENDAR_NAME),
  eventTitle: String(process.env.EVENT_TITLE),
};

module.exports = config;
