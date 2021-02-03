const express = require("express");
const router = express.Router();

const Volunteer = require("../models/volunteer");
const User = require("../models/user");

//Access control
const AuthController = require("../controllers/AuthController");
const accessMiddleware = require("../middlewares/accessMiddlewares");
const authenticate = accessMiddleware.authenticate;
const authorizeHelpSeeker = accessMiddleware.authHelpSeeker;

//validation
const { check, validationResult } = require("express-validator");

// Get All Volunteers Route
router.get("/", authenticate, authorizeHelpSeeker, async (req, res) => {
  let query = Volunteer.find();
  if (req.query.firstName != null && req.query.firstName !== "") {
    query = query.regex("name.first", new RegExp(req.query.firstName, "i"));
  }
  if (req.query.lastName != null && req.query.lastName !== "") {
    query = query.regex("name.last", new RegExp(req.query.lastName, "i"));
  }
  try {
    const volunteers = await query.exec();
    res.render("volunteers/index", {
      volunteers: volunteers,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Volunteer Route
router.get("/new", async (req, res) => {
  res.render("volunteers/new", { req: req });
});

router.post(
  "/",
  [
    check("firstName").not().isEmpty().withMessage("First Name is required"),
    check("lastName").not().isEmpty().withMessage("Last Name is required"),
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
      const volunteer = new Volunteer({
        name: { first: req.body.firstName, last: req.body.lastName },
        nationality: req.body.nationality,
        user: req.body.phone,
      });
      //register user
      await AuthController.register(req, res);

      try {
        const newVolunteer = await volunteer.save();
        //res.redirect(`helpSeeker/${newHelpSeeker.id}`)
        res.redirect("help");
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
    res.render(`volunteers/${form}`, params);
  } catch {
    res.redirect("/volunteer/new");
  }
}

function savePicture(volunteer, encodedPic) {
  if (encodedPic == null) return;
  const pic = JSON.parse(encodedPic);
  if (pic != null && imageMimeTypes.includes(pic.type)) {
    volunteer.profilePic = new Buffer.from(pic.data, "base64");
    volunteer.profilePicType = pic.type;
  }
}

module.exports = router;
