document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('form[action="/users/register"]');

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form fields
    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');
    const contact = form.querySelector('input[name="contact"]');
    const email = form.querySelector('input[name="email"]');
    const dob = form.querySelector('input[name="dob"]');
    const gender = form.querySelector('select[name="gender"]');
    const files = form.querySelector('input[name="files"]');

    // Validate fields
    if (!firstName.value.trim()) {
      alert("First Name is required");
      firstName.focus();
      return;
    }

    if (!lastName.value.trim()) {
      alert("Last Name is required");
      lastName.focus();
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!contact.value.trim() || !phoneRegex.test(contact.value)) {
      alert("Please enter a valid 10-digit Phone Number");
      contact.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      alert("Please enter a valid Email");
      email.focus();
      return;
    }

    if (!dob.value.trim() || isNaN(Date.parse(dob.value))) {
      alert("Please enter a valid Date of Birth");
      dob.focus();
      return;
    }

    if (!gender.value) {
      alert("Gender is required");
      gender.focus();
      return;
    }

    // Check for file upload (optional)
    if (files.files.length > 0) {
      const validExtensions = [
        "jpg",
        "jpeg",
        "png",
        "txt",
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
      ];
      for (const file of files.files) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          alert(`Invalid file type: ${file.name}`);
          files.focus();
          return;
        }
      }
    }
    // If all validations pass, submit the form
    form.submit();
  });
});
