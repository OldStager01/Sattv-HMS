const config = require("../config/config");
const { listEvents } = require("../services/calendar/calenderServices");
const {
  createUserEvent,
  updateUserAppointment,
  verifyUser,
} = require("../services/user");

const listEventsHandler = async (req, res) => {
  try {
    const events = await listEvents(config.calendarName);
    res.status(200).json({ events });
  } catch (error) {
    console.error("Calender Controller :: listEventsHandler :: error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createEventHandler = async (req, res) => {
  try {
    let { title, description, startDate, endDate, attendees } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    attendees = attendees.split(",");
    attendees.forEach((attendee, index) => {
      attendees[index] = attendee.trim();
    });

    createUserEvent({
      title,
      description,
      start: startDate,
      end: endDate,
      attendees,
    });
    res.status(200).json({ message: "Event created successfully" });
  } catch (error) {
    console.error(
      "Calender Controller :: createEventHandler :: error: ",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateEventHandler = async (req, res) => {
  try {
    const { id, title, description, start, end, attendees } = req.body;
    if ((await verifyUser(id)) === false) {
      return res.status(404).send("User not found");
    }
    await updateUserAppointment(id, {
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      attendees,
    });
    res.send("Appointment updated");
  } catch (error) {
    console.error(
      "Calendar Controller :: updateAppointment :: Error :: ",
      error
    );
    res.status(500).send("Error updating appointment.");
  }
};

module.exports = { listEventsHandler, createEventHandler, updateEventHandler };
