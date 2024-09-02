const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../temp"));
  },
  filename: function (req, file, cb) {
    const cleanedFilename = `${file.originalname
      .trim()
      .replace(/[^\w\-_.]/g, "")}`;
    const filename = `${path.basename(
      cleanedFilename,
      path.extname(cleanedFilename)
    )}-${Date.now()}${path.extname(cleanedFilename)}`;
    cb(null, filename);
  },
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("application/pdf") ||
    file.mimetype.startsWith("application/msword") ||
    file.mimetype.startsWith(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) ||
    file.mimetype === "text/plain"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
