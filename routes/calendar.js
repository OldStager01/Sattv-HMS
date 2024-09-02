const express = require("express");
const isOAuth = require("../middleware/isOAuth");

const {
  listEventsHandler,
  createEventHandler,
  updateEventHandler,
} = require("../controller/calenderController");
const router = new express.Router();

router.use(isOAuth);

router.get("/events", listEventsHandler);

router.get("/create", (req, res) => {
  res.render("./Test/createEvent");
});

router.post("/create", createEventHandler);

router.get("/update", (req, res) => {
  res.render("./Test/updateEvent");
});
router.post("/update", updateEventHandler);

module.exports = router;
