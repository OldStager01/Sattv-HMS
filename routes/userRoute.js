const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  registerController,
  listUsersController,
  getUserById,
  newAppointmentController,
  editNextAppointment,
  editUserProfileController,
} = require("../controller/userController");

const { getUserData } = require("../services/user");

const { getDate } = require("../utils");

//!List Users Route
router.get("/", listUsersController);
//!Register Route
router.get("/register", (req, res) => {
  res.render("Register/register", {
    authUser: req.session.user,
    title: "New Registeration - Sattv",
    pageName: "New Registration",
    breadcrumb: "Participants / New Registration",
  });
});
router.post("/register", upload.array("files"), registerController);

//!Get User By ID Route
router.get("/:id", getUserById);

//!New Appointment Route
router.get("/:id/appointment", async (req, res) => {
  try {
    const id = req.params.id.toLocaleUpperCase();
    const userData = await getUserData(id);
    let today = await getDate();
    today = today.date;
    if (!today || isNaN(Date.parse(today))) {
      today = new Date();
    }
    if (!id || !userData) {
      res.status(404).send("User not found");
    }
    res.render("Participants/appointment", {
      id,
      authUser: req.session.user,
      title: "New Appointment - Sattv",
      pageName: "New Appointment",
      breadcrumb: "Participants / New Appointment",
      user: userData.user,
      today: today.toLocaleDateString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("error", {
      title: "Error - Sattv",
      pageName: "Error",
      breadcrumb: "Error",
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
});
router.post(
  "/:id/appointment",
  upload.array("files"),
  newAppointmentController
);
//!Edit Next Appointment Date Route
router.post("/:id/appointment/edit", editNextAppointment);

//!Edit User Route
router.post("/:id/edit", editUserProfileController);
module.exports = router;
