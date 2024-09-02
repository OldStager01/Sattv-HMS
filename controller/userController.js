const registerModel = require("../model/registerModel");
const {
  register,
  listUsers,
  getUserData,
  verifyUser,
} = require("../services/user");
const newAppointment = require("../services/user/appointment/newAppointment");
const updateUserAppointment = require("../services/user/appointment/updateUserAppointment");
const editUserProfile = require("../services/user/editUser/editUserProfile");
const { getDate } = require("../utils/");
const dashboardController = async (req, res) => {
  try {
    const { users, totalUsers } = await listUsers({
      status: "active",
      today: true,
    });
    res.render("Dashboard/dashboard", {
      authUser: req.session.user,
      title: "Home",
      pageName: "Dashboard",
      breadcrumb: "Dashboard",
      totalUsers,
      users: users,
    });
  } catch (error) {
    console.error("User Controller :: dashboardController :: Error :: ", error);
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
};

const registerController = async (req, res) => {
  //Create new instance of object
  const userData = registerModel();

  //Assign values to object from request body
  Object.assign(userData, req.body);
  userData.files = req.files;

  //Check if any value is null or undefined
  const isNull = Object.values(userData).some(
    (value) => value === null || value === undefined
  );
  if (isNull) {
    return res.status(400).render("error", {
      title: "Error - Sattv",
      pageName: "Error",
      breadcrumb: "Error",
      error: {
        code: 400,
        message: "Bad Request",
      },
    });
  }
  try {
    await register(userData);
    res.redirect("/users");
  } catch (error) {
    console.error("User Controller :: registerController :: Error :: ", error);
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
};

const listUsersController = async (req, res) => {
  try {
    const { status } = req?.query;
    const { users } = await listUsers({ status });
    res.render("Participants/participants", {
      authUser: req.session.user,
      title: "Participants - Sattv",
      pageName: "Participants",
      breadcrumb: "Participants",
      users: users,
      // users: [],
    });
  } catch (error) {
    console.error("User Controller :: getAllUsers :: Error :: ", error);
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
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "favicon.ico") return;
    const userData = await getUserData(id);
    if (userData === null) {
      return res.status(404).render("error", {
        title: "Error - Sattv",
        pageName: "Error",
        breadcrumb: "Error",
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
    const { users } = await listUsers({});
    const user = users.find((user) => user.id == id);
    let today = await getDate();
    today = today.date;
    if (isNaN(Date.parse(today))) {
      today = new Date();
    }
    // const userData = {};
    res.render("Participants/user", {
      authUser: req.session.user,
      title: "User - Sattv",
      pageName: "User Data",
      breadcrumb: "Participants / User Data",
      userData: userData,
      nextAppointmentDate: user?.nextAppointmentDate,
      id: id,
      today: today.toLocaleDateString(),
    });
  } catch (error) {
    console.error("User Controller :: getUserById :: Error :: ", error);
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
};

const newAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;
    if ((await verifyUser(id)) === false) {
      return res.status(404).render("error", {
        title: "Error - Sattv",
        pageName: "Error",
        breadcrumb: "Error",
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
    await newAppointment(id, req.body, req.files);
    res.redirect(`/users/${id}`);
  } catch (error) {
    console.error(
      "User Controller :: newAppointmentController :: Error :: ",
      error
    );
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
};

const editNextAppointment = async (req, res) => {
  try {
    const id = req.params.id.toLocaleUpperCase();
    const { nextAppointmentDate } = req.body;
    console.log(nextAppointmentDate);

    if (!id || !nextAppointmentDate) {
      res.status(404).render("error", {
        title: "Error - Sattv",
        pageName: "Error",
        breadcrumb: "Error",
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
    if (isNaN(Date.parse(nextAppointmentDate))) {
      res.status(400).render("error", {
        title: "Error - Sattv",
        pageName: "Error",
        breadcrumb: "Error",
        error: {
          code: 400,
          message: "Bad Request",
        },
      });
    }
    await updateUserAppointment(id, { start: new Date(nextAppointmentDate) });
    res.redirect(`/users/${id}`);
  } catch (error) {
    console.error("User Controller :: editNextAppointment :: Error :: ", error);
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
};

const editUserProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    console.log("req.body", req.body);
    await editUserProfile(id, req.body);
    res.redirect(`/users/${id}`);
  } catch (error) {
    console.error("User Controller :: updateUser :: Error :: ", error);
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
};

module.exports = {
  dashboardController,
  registerController,
  listUsersController,
  getUserById,
  newAppointmentController,
  editNextAppointment,
  editUserProfileController,
};
