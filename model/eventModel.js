const transferObject = require("../utils/transferObject");
const newEvent = (eventObj) => {
  const properties = [
    "summary",
    "location",
    "description",
    "start",
    "end",
    "recurrence",
    "attendees",
    "reminders",
    "colorId",
    "visibility",
    "transparency",
    "status",
    "organizer",
    "creator",
    "source",
  ];
  const event = transferObject(eventObj, properties);
  //Add other Props
  event.guestCanInviteOthers = false;
  event.guestsCanModify = false;
  event.guestsCanSeeOtherGuests = false;
  return event;
};
module.exports = newEvent;
