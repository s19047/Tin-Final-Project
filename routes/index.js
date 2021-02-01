const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  res.render("index");
});

router.post(
  "/",
  [
    check("phone")
      .not()
      .isEmpty()
      .withMessage("Phone is required")
      .isMobilePhone()
      .withMessage("Invalid Phone Number"),
    check("password").not().isEmpty().withMessage("Password is required"),
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
      params = { errorMsg: errors[0] };
      res.redirect("../");
    } else {
      await AuthController.login(req, res);
    }
  }
);

module.exports = router;
