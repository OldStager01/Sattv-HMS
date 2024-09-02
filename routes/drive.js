const express = require("express");
const {
  listFilesHandler,
  createFolderHandler,
  uploadFileHandler,
  trashHandler,
  moveFileHandler,
} = require("../controller/driveController");
const upload = require("../config/multer");

const router = express.Router();

router.get("/list", listFilesHandler);

router.post("/createFolder", createFolderHandler);

router.post("/uploadFiles", upload.array("files"), uploadFileHandler);

router.post("/trash", trashHandler);

router.post("/move", moveFileHandler);

module.exports = router;
