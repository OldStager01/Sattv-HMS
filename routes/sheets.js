const express = require("express");
const isOAuth = require("../middleware/isOAuth");
const {
  getSheetDataController,
  createDocController,
} = require("../controller/sheetsController");

const router = new express.Router();

router.use(isOAuth);

router.post("/create", createDocController);

router.get("/readSheet", getSheetDataController);

module.exports = router;
