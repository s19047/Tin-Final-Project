const express = require("express");
const router = express.Router();
const Help = require("../models/help");
const User = require("../models/user");
const Volunteer = require("../models/volunteer");
//validation
const { check, validationResult } = require("express-validator");

//Access control
const accessMiddleware = require("../middlewares/accessMiddlewares");
const authenticate = accessMiddleware.authenticate;
const authorizeVolunteer = accessMiddleware.authVolunteer;
const authorizeHelpSeeker = accessMiddleware.authHelpSeeker;

//show help offers for help seeker
router.get("/", authenticate, authorizeHelpSeeker, async (req, res) => {
  //get help offers fo seeker
  let users = [];
  Help.find({ helpSeeker: req.loggedUser.id }).then((offers) => {
    offers.forEach((offer) => {
      User.findOne({ phone: offer.volunteer }).then((user) => {
        users.push(user);
        let searchOptions = {};
        res.render("help/index", { offers, users, searchOptions });
      });
    });
  });
});

router.get("/book", async (req, res) => {
  res.render("help/book", { req: req });
});

//allow volunteer to book help offer
router.post(
  "/book",
  [
    check("date").not().isEmpty().withMessage("desired help date is required"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("help desciption is required"),
  ],
  async (req, res) => {
    // Check for Errors
    const validationErrors = validationResult(req);
    let errors = [];
    if (!validationErrors.isEmpty()) {
      Object.keys(validationErrors.mapped()).forEach((field) => {
        errors.push(validationErrors.mapped()[field]["msg"]);
      });
    }

    if (errors.length) {
      renderNewPage(req, res, errors[0]);
    } else {
      const help = new Help({
        volunteer: req.body.volunteer,
        helpSeeker: req.body.helpSeeker,
        date: new Date(req.body.date),
        description: req.body.description,
      });

      try {
        const newHelp = help.save();
        res.locals.alertMsg = "help was booked successfuly";
        res.redirect("/helpSeeker");
      } catch (err) {
        renderNewPage(req, res, err);
      }
    }
  }
);

async function renderNewPage(req, res, err) {
  renderFormPage(req, res, "new", err);
}

async function renderFormPage(req, res, form, err) {
  try {
    const params = {
      req: req,
    };
    if (err) {
      if (form === "edit") {
        //params.errorMsg = "Error Updating helpSeeker";
      } else {
        // params.errorMsg = "Error Creating helpSeeker";
      }
    }

    params.errorMsg = err;
    res.render("help/book", params);
  } catch {
    res.redirect("/helpSeeker");
  }
}

module.exports = router;
