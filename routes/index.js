const express = require("express");
const router = express.Router();
//const Book = require('../models/book')

router.get("/", async (req, res) => {
  res.render("index");
});

module.exports = router;
