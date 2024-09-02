import { formatTime, parseEJSObjectString } from "/js/index.js";

// Get the user data from the EJS template
const userDataJson = parseEJSObjectString(userData);

// Set the next appointment time for each user
const elements = document.querySelectorAll(".appointmentTime");
document.addEventListener("DOMContentLoaded", () => {
  userDataJson.forEach((user, index) => {
    elements[index].innerHTML = formatTime(user.nextAppointmentDate);
  });
});

//Set the upcoming clients, pending Payements and
