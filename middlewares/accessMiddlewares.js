const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const params = {
    req: req,
  };

  try {
    const token = req.session.jwt;
    const decode = jwt.verify(token, process.env.TOKEN_KEY);

    req.loggedUser = decode;
    res.locals.loggedUser = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(400);
    params.errorMsg = "Authentication Failed.";
    res.redirect("../");
  }
};

const authVolunteer = (req, res, next) => {
  if (req.loggedUser.role != "V" && req.loggedUser.role != "A") {
    console.log("Only volunteers allowed!");
    res.redirect("../");
  } else {
    next();
  }
};

const authHelpSeeker = (req, res, next) => {
  if (req.loggedUser.role != "H" && req.loggedUser.role != "A") {
    console.log("Only helpSeekers allowed!");
    res.redirect("../");
  } else {
    next();
  }
};

module.exports = { authenticate, authHelpSeeker, authVolunteer };
