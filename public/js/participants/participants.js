import { formatDate, parseEJSObjectString } from "/js/index.js";
document.addEventListener("DOMContentLoaded", function () {
  const userStatusButtons = document.querySelectorAll(".filter-button");
  addFilterTask(userStatusButtons, ".filter-button");
  const paymentStatusButtons = document.querySelectorAll(".filter-payment");
  addFilterTask(paymentStatusButtons, ".filter-payment");

  //Format date
  const pasrsedUserData = parseEJSObjectString(userData);
  const nextAppointmentDates = pasrsedUserData.map((user) => {
    if (user.nextAppointmentDate == null || user.nextAppointmentDate == "")
      return "No appointment scheduled";
    return formatDate(user.nextAppointmentDate);
  });
  const lastAppointmentDates = pasrsedUserData.map((user) => {
    if (user.lastAppointmentDate == null || user.lastAppointmentDate == "")
      return "No appointment scheduled";
    return formatDate(user.lastAppointmentDate);
  });

  const nextAppointmentDateElements = document.querySelectorAll(
    ".nextAppointmentDate"
  );
  const lastAppointmentDateElements = document.querySelectorAll(
    ".lastAppointmentDate"
  );

  nextAppointmentDateElements.forEach((element, index) => {
    element.textContent = nextAppointmentDates[index];
  });
  lastAppointmentDateElements.forEach((element, index) => {
    element.textContent = lastAppointmentDates[index];
  });
  // Apply default filters on load
  filterTasks();
});

function addFilterTask(buttons, filterType) {
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      setActiveFilter(this, filterType); // Update the active class
      filterTasks(); // Call your function to filter tasks
    });
  });
}

function setActiveFilter(activeButton, filterType) {
  const filterButtons = document.querySelectorAll(filterType);

  filterButtons.forEach((button) => {
    button.classList.remove("active"); // Remove active class from all buttons
  });

  activeButton.classList.add("active"); // Add active class to the clicked button
}
function filterTasks() {
  const userStatus = document.querySelector(".filter-button.active").dataset
    .status;
  const paymentStatus = document.querySelector(".filter-payment.active").dataset
    .status;
  console.log("User Status:", userStatus);
  console.log("Payment Status:", paymentStatus);

  const allTasks = document.querySelectorAll("table tr");
  console.log("All Tasks:", allTasks);

  allTasks.forEach((task) => {
    const taskUserStatus = task.dataset.status;
    const taskPaymentStatus = task.dataset.payment;
    console.log("Task User Status:", taskUserStatus);
    console.log("Task Payment Status:", taskPaymentStatus);

    const userStatusMatch =
      userStatus === "all" || taskUserStatus === userStatus;
    const paymentStatusMatch =
      paymentStatus === "all" || taskPaymentStatus === paymentStatus;

    console.log("Task User Status:", taskUserStatus);
    console.log("Task Payment Status:", taskPaymentStatus);
    console.log("User Status Match:", userStatusMatch);
    console.log("Payment Status Match:", paymentStatusMatch);

    // Log the current display property
    console.log("Current Display:", task.style.display);

    if (userStatusMatch && paymentStatusMatch) {
      task.style.display = ""; // Ensure display is set to default
    } else {
      task.style.display = "none"; // Hide the task row
    }

    // Log the updated display property
    console.log("Updated Display:", task.style.display);
  });
}
