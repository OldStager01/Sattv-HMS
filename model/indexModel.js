//!Match the object keys with the names of the input fields in the form
//!Remember: Any change in the input field name should be reflected here
//!Compulsory fields: firstName, lastName
//!Temporary fields: files (for file upload)
function indexModel() {
  return {
    id: "",
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    createdAt: "",
    status: "",
    nextAppointmentDate: "",
    lastAppointmentDate: "",
    paymentStatus: "",
    eventId: "",
  };
}

module.exports = indexModel;
