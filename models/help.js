const mongoose = require("mongoose");

const helpSchema = mongoose.Schema({
  volunteer: {
    type: String,
    required: true,
    ref: "Volunteer",
  },
  helpSeeker: {
    type: String,
    required: true,
    ref: "HelpSeeker",
  },
  date: { type: Date, required: true, default: Date.now },
  descripton: { type: String },
});

module.exports = mongoose.model("Help", helpSchema);
