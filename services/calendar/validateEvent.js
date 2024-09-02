const isValidEvent = (event) => {
  if (!event || typeof event !== "object") return false;

  const {
    summary,
    location,
    description,
    start,
    end,
    recurrence,
    attendees,
    reminders,
    colorId,
    visibility,
    transparency,
    status,
    organizer,
    creator,
    source,
  } = event;

  // Validate required fields
  if (summary && typeof summary !== "string") return false;
  if (location && typeof location !== "string") return false;
  if (description && typeof description !== "string") return false;

  // Validate start and end times
  if (
    !start ||
    typeof start !== "object" ||
    typeof start.dateTime !== "string" ||
    typeof start.timeZone !== "string"
  ) {
    return false;
  }
  if (
    typeof end !== "object" ||
    typeof end.dateTime !== "string" ||
    typeof end.timeZone !== "string"
  ) {
    return false;
  }

  // Validate optional fields
  if (recurrence && !Array.isArray(recurrence)) return false;
  if (attendees && !Array.isArray(attendees)) return false;
  if (
    attendees &&
    attendees.some((attendee) => typeof attendee.email !== "string")
  )
    return false;

  if (reminders) {
    if (typeof reminders.useDefault !== "boolean") return false;
    if (reminders.overrides && !Array.isArray(reminders.overrides))
      return false;
    if (
      reminders.overrides &&
      reminders.overrides.some(
        (reminder) =>
          typeof reminder.method !== "string" ||
          typeof reminder.minutes !== "number"
      )
    ) {
      return false;
    }
  }

  // Additional optional fields
  if (colorId && typeof colorId !== "string") return false;
  if (
    visibility &&
    !["default", "public", "private", "confidential"].includes(visibility)
  )
    return false;
  if (transparency && !["opaque", "transparent"].includes(transparency))
    return false;
  if (status && !["confirmed", "tentative", "cancelled"].includes(status))
    return false;

  if (
    organizer &&
    (typeof organizer !== "object" || typeof organizer.email !== "string")
  )
    return false;
  if (
    creator &&
    (typeof creator !== "object" || typeof creator.email !== "string")
  )
    return false;

  if (source) {
    if (
      typeof source !== "object" ||
      typeof source.title !== "string" ||
      typeof source.url !== "string"
    ) {
      return false;
    }
  }

  return true;
};

module.exports = isValidEvent;
