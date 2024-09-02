document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("appointmentForm");
  console.log(form);
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form fields
    const weight = form.querySelector('input[name="weight"]');
    const waistCircumference = form.querySelector(
      'input[name="waistCircumference"]'
    );
    const bloodPressure = form.querySelector('input[name="bloodPressure"]');
    const guidelines = form.querySelector('textarea[name="guidelines"]');
    const notes = form.querySelector('textarea[name="notes"]');
    const files = form.querySelector('input[name="files"]');

    if (
      !weight.value.trim() &&
      !waistCircumference.value.trim() &&
      !bloodPressure.value.trim() &&
      !guidelines.value.trim() &&
      !notes.value.trim() &&
      files.files.length === 0
    ) {
      alert("Please fill in at least one field to submit the form");
      return;
    }

    // Validate fields if they contain data
    if (weight.value.trim() && isNaN(weight.value)) {
      alert("Current Weight must be a number");
      weight.focus();
      return;
    }

    if (waistCircumference.value.trim() && isNaN(waistCircumference.value)) {
      alert("Waist Circumference must be a number");
      waistCircumference.focus();
      return;
    }

    if (bloodPressure.value.trim() && !/^\d+\/\d+$/.test(bloodPressure.value)) {
      alert("Blood Pressure must be in the format '120/80'");
      bloodPressure.focus();
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
