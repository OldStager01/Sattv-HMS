//!Match the object keys with the names of the input fields in the form
//!Remember: Any change in the input field name should be reflected here
//!Compulsory fields: firstName, lastName
function userModel() {
  return {
    id: "",
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    dob: null,
    gender: "",
    martialStatus: "",
    ethnicity: "",
    createdAt: "",
  };
}

module.exports = userModel;
