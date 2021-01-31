const express = require("express");
const router = express.Router();
const HelpSeeker = require("../models/helpSeeker");
const User = require("../models/User");

const AuthController = require("../controllers/AuthController");
//validation
const { check, validationResult } = require("express-validator/check");

// Get All HelpSeekers Route
router.get("/", async (req, res) => {
  let userQuery = User.find();

  if (req.query.firstName != null && req.query.firstName !== "") {
    userQuery = userQuery.regex(
      "name.first",
      new RegExp(req.query.firstName, "i")
    );
  }
  if (req.query.lastName != null && req.query.lastName !== "") {
    userQuery = userQuery.regex(
      "name.last",
      new RegExp(req.query.lastName, "i")
    );
  }
  try {
    const users = await userQuery.exec();

    res.render("helpSeekers/index", {
      users: users,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New HelpSeeker Route
router.get("/new", (req, res) => {
  res.render("helpSeekers/new", { req: req });
});

// Create New HelpSeeker Route
router.post(
  "/",
  [
    check("firstName").not().isEmpty().withMessage("First Name is required"),
    check("lastName").not().isEmpty().withMessage("Last Name is required"),
    check("address").not().isEmpty().withMessage("Address is required"),
    check("preferredDate")
      .not()
      .isEmpty()
      .withMessage("Preferred Date is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("profilePic")
      .not()
      .isEmpty()
      .withMessage("Please Upload a profile picture"),
    check("phone")
      .not()
      .isEmpty()
      .withMessage("Phone is required")
      .isMobilePhone()
      .withMessage("Invalid Phone Number")
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          User.findOne({ phone: req.body.phone }, function (err, user) {
            if (err) {
              reject(new Error("Server Error"));
            }
            if (Boolean(user)) {
              reject(new Error("Phone Number already in use"));
            }
            resolve(true);
          });
        });
      }),
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
      const helpSeeker = new HelpSeeker({
        address: req.body.address,
        helpDesired: req.body.helpDesired,
        user: req.body.phone,
        preferredDate: new Date(req.body.preferredDate),
      });
      //register user
      await AuthController.register(req, res);

      try {
        const newHelpSeeker = await helpSeeker.save();
        //res.redirect(`helpSeeker/${newHelpSeeker.id}`)
        res.redirect("helpSeeker");
      } catch (err) {
        renderNewPage(req, res, err);
      }
    }
  }
);

async function renderNewPage(req, res, err) {
  renderFormPage(req, res, "new", err);
}

async function renderEditPage(req, res, err) {
  renderFormPage(req, res, "edit", err);
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
    res.render(`helpSeekers/${form}`, params);
  } catch {
    res.redirect("/helpSeeker/new");
  }
}

module.exports = router;
//value="<%= req.body.preferredDate == null ? '' : req.body.preferredDate.toISOString().split('T')[0] %>"
