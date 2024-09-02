import { parseEJSObjectString, formatDate } from "../index.js";
document.addEventListener("DOMContentLoaded", function () {
  //Load the gender
  const genderSelect = document.getElementsByName("gender")[0];
  const parsedUserData = parseEJSObjectString(userData);
  let todayDate = parseEJSObjectString(today);
  genderSelect.value = parsedUserData.gender;

  //Calculate the age
  todayDate = new Date(todayDate);
  const dob = new Date(parsedUserData.dob);
  if (isNaN(todayDate.getTime())) {
    todayDate = new Date();
  }
  const age = calculateAge(todayDate, dob);
  const ageElement = document.getElementById("age");
  ageElement.value = age;
  console.log(todayDate, dob, age);
  function calculateAge(today, dob) {
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
  //Edit Button Handler of User Data
  const editButton = document.getElementById("editButton");
  const submitButton = document.getElementById("submitButton");
  const cancelButton = document.getElementById("cancelButton");
  const userForm = document.getElementById("userForm");
  const userFormElements = userForm.querySelectorAll("input, select");

  let initialValues = {};

  function toggleButtons(isEditing) {
    editButton.classList.toggle("hidden", isEditing);
    editButton.classList.toggle("inline-flex", !isEditing);

    submitButton.classList.toggle("hidden", !isEditing);
    submitButton.classList.toggle("inline-flex", isEditing);

    cancelButton.classList.toggle("hidden", !isEditing);
    cancelButton.classList.toggle("inline-flex", isEditing);

    userFormElements.forEach((input) => {
      if (input.name === "dob" || input.name == "age") {
        return;
      }
      input.disabled = !isEditing;
    });
  }

  function storeInitialValues() {
    initialValues = {};
    userFormElements.forEach((input) => {
      initialValues[input.name] = input.value;
    });
  }

  function restoreInitialValues() {
    userFormElements.forEach((input) => {
      input.value = initialValues[input.name];
    });
  }

  editButton.addEventListener("click", function () {
    storeInitialValues();
    toggleButtons(true);
  });

  cancelButton.addEventListener("click", function () {
    restoreInitialValues();
    toggleButtons(false);
  });
  //Edit Button Handler of Next Appointment Date
  const editDateButton = document.getElementById("editDateButton");
  const submitDateButton = document.getElementById("submitDateButton");
  const cancelDateButton = document.getElementById("cancelDateButton");
  const dateFormElement = document.getElementById("editNextAppointmentForm");
  const dateElement = document.getElementById("editNextAppointment");

  function toggleDateButtons(isEditing) {
    editDateButton.classList.toggle("hidden", isEditing);
    editDateButton.classList.toggle("inline-flex", !isEditing);

    submitDateButton.classList.toggle("hidden", !isEditing);
    submitDateButton.classList.toggle("inline-flex", isEditing);

    cancelDateButton.classList.toggle("hidden", !isEditing);
    cancelDateButton.classList.toggle("inline-flex", isEditing);
  }
  editDateButton.addEventListener("click", function () {
    dateFormElement.hidden = false;
    dateElement.required = true;
    toggleDateButtons(true);
  });

  cancelDateButton.addEventListener("click", function () {
    dateFormElement.hidden = true;
    toggleDateButtons(false);
  });

  //Format the next appointment date
  const parsedNextAppointment = parseEJSObjectString(nextAppointmentDate);
  const nextAppointmentDateInput = document.getElementById(
    "nextAppointmentDate"
  );
  nextAppointmentDateInput.innerText = formatDate(parsedNextAppointment);
  console.log(parsedUserData);
});
