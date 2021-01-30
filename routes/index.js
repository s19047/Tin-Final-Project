const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Get All HelpSeekers Route
router.get("/", async (req, res) => {
  res.render("index");
});

// New HelpSeeker Route
router.get("/new", async (req, res) => {});

router.post("/", async (req, res) => {
  await AuthController.login(req, res);
});

module.exports = router;
