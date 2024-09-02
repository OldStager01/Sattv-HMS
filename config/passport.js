const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const config = require("./config");

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: `http://localhost:3000/auth/google/callback`,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  //Store user id in session
  process.nextTick(function () {
    return done(null, user.id);
  });
});
passport.deserializeUser((user, done) => {
  //Retrive user from session
  process.nextTick(function () {
    return done(null, user);
  });
});

module.exports = passport;
