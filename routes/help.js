const express = require("express");
const router = express.Router();
const HelpSeeker = require("../models/helpSeeker");

// Get All HelpSeekers Route
router.get("/", async (req, res) => {});

// New HelpSeeker Route
router.get("/book", async (req, res) => {
  res.render("help/book", { req: req });
});

// Create New HelpSeeker Route
router.post("/book", async (req, res) => {});

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
