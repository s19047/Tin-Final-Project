const express = require("express");
const router = express.Router();
const HelpSeeker = require("../models/helpSeeker");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// Get All HelpSeekers Route
router.get("/", async (req, res) => {
  let query = HelpSeeker.find();
  if (req.query.firstName != null && req.query.firstName !== "") {
    query = query.regex("firstName", new RegExp(req.query.firstName, "i"));
  }
  if (req.query.lastName != null && req.query.lastName !== "") {
    query = query.regex("lastName", new RegExp(req.query.lastName, "i"));
  }
  try {
    const helpSeekers = await query.exec();
    res.render("helpSeekers/index", {
      helpSeekers: helpSeekers,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New HelpSeeker Route
router.get("/new", (req, res) => {
  res.render("helpSeekers/new", { helpSeeker: new HelpSeeker() });
});

// Create New HelpSeeker Route
router.post("/", async (req, res) => {
  const helpSeeker = new HelpSeeker({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phone: req.body.phone,
    helpDesired: req.body.helpDesired,
    preferredDate: new Date(req.body.preferredDate),
  });

  try {
    savePicture(helpSeeker, req.body.profilePic);
    const newHelpSeeker = await helpSeeker.save();
    //res.redirect(`helpSeeker/${newHelpSeeker.id}`)
    res.redirect("helpSeeker");
  } catch (err) {
    renderNewPage(res, helpSeeker, true);
    console.log(err);
  }
});

async function renderNewPage(res, helpSeeker, hasError = false) {
  renderFormPage(res, helpSeeker, "new", hasError);
}

async function renderEditPage(res, helpSeeker, hasError = false) {
  renderFormPage(res, helpSeeker, "edit", hasError);
}

async function renderFormPage(res, helpSeeker, form, hasError = false) {
  try {
    const params = {
      helpSeeker: helpSeeker,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMsg = "Error Updating helpSeeker";
      } else {
        params.errorMsg = "Error Creating helpSeeker";
      }
    }
    res.render(`helpSeekers/${form}`, params);
  } catch {
    res.redirect("/helpSeeker");
  }
}

function savePicture(helpSeeker, encodedPic) {
  if (encodedPic == null) return;
  const pic = JSON.parse(encodedPic);
  if (pic != null && imageMimeTypes.includes(pic.type)) {
    helpSeeker.profilePic = new Buffer.from(pic.data, "base64");
    helpSeeker.profilePicType = pic.type;
  }
}

module.exports = router;
