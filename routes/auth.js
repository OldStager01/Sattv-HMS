const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const { setOAuth2Client } = require("../config/googleServiceAuth");
//Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/calendar",
    ],
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/", //!Change it as required
  }),
  (req, res) => {
    //Setting the session variables
    req.session.accessToken = req.user.accessToken;
    req.session.user = req.user._json;

    //Setting the OAuth2Client
    setOAuth2Client({ accessToken: req.user.accessToken });

    const returnTo = req.session.returnTo || "/";
    console.log(returnTo);
    delete req.session.returnTo;
    //Redirecting to the homepage
    res.redirect(returnTo);
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

module.exports = router;
