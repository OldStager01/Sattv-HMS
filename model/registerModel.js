//!Match the object keys with the names of the input fields in the form
//!Remember: Any change in the input field name should be reflected here
//!Compulsory fields: firstName, lastName
//!Temporary fields: files (for file upload)
function registerModel() {
  return {
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    dob: null,
    gender: "",
    files: [], //!Temporary field for file upload
  };
}

module.exports = registerModel;
