const express = require("express");
const router = express.Router();
const User = require("../models/user");
const AuthController = require("../controllers/AuthController");

router.post("/", async (req, res) => {
  await AuthController.login(req, res);
});

module.exports = router;
