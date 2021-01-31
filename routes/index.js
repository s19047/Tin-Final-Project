const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/", async (req, res) => {
  res.render("index");
});

router.post("/", async (req, res) => {
  await AuthController.login(req, res);
});

module.exports = router;
