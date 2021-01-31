const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");

// Get All Volunteers Route
router.get("/", async (req, res) => {
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
  res.render("volunteers/new", { volunteer: new Volunteer() });
});

// Create New Volunteer Route
router.post("/", async (req, res) => {
  const volunteer = new Volunteer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    phone: req.body.phone,
  });
  try {
    const newVolunteer = await volunteer.save();
    //res.redirect(`volunteer/${newVolunteer.id}`)
    res.redirect("volunteer");
  } catch (err) {
    res.render("volunteers/new", {
      volunteer: volunteer,
      errorMsg: err,
    });
  }
  //console.log(req.body);
});

module.exports = router;
