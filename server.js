//*Import Packages
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const favicon = require("serve-favicon");

//*Import Controller
const { dashboardController } = require("./controller/userController");

//*Import Routers
const googleAuthRoute = require("./routes/auth");
const sheetsRouter = require("./routes/sheets");
const driveRouter = require("./routes/drive");
const userRouter = require("./routes/userRoute");
const calendarRouter = require("./routes/calendar");

//*Import Middleware
const isOAuth = require("./middleware/isOAuth");

//*Initialize App
const app = express();
const PORT = 3000;

//*View Engine
app.set("view engine", "ejs");
app.set("views", "./views");

//*Static Files
app.use(express.static(path.join(__dirname, "public")));

//*Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set up the favicon middleware
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//*Routes
app.get("/", async (req, res) => {
  res.render("index", {
    title: "Home",
    pageName: "Home",
    breadcrumb: "Home",
  });
});

//*Layouts
app.use(expressLayouts);
app.set("layout", "layouts/layout");

app.get("/dashboard", isOAuth, dashboardController);

app.use("/auth", googleAuthRoute);

app.use("/sheets", isOAuth, sheetsRouter);

app.use("/drive", isOAuth, driveRouter);

app.use("/users", isOAuth, userRouter);

app.use("/calendar", isOAuth, calendarRouter);

// app.get("/check", (req, res) => {
//   res.send(req.session);
// });

app.use((req, res) => {
  res.status(404).render("error", {
    layout: false,
    title: "404",
    pageName: "404",
    breadcrumb: "404",
    error: {
      code: 404,
      message: "Page Not Found",
    },
  });
});

//*Start the server
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));
