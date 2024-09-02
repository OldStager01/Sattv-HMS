const {
  getOAuth2Client,
  setOAuth2Client,
} = require("../config/googleServiceAuth");

const isOAuth = (req, res, next) => {
  req.session.returnTo = req.originalUrl || "/";
  if (req.isAuthenticated() && getOAuth2Client() && req.session.accessToken) {
    next();
  } else {
    if (req.session.accessToken) {
      setOAuth2Client({ accessToken: req.session.accessToken });
      if (getOAuth2Client()) {
        next();
      }
    }
    res.redirect("/auth/google");
  }
};

module.exports = isOAuth;
