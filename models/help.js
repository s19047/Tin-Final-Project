const mongoose = require("mongoose");

const helpSchema = mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Volunteer",
  },
  helpSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "HelpSeeker",
  },
  date: { type: Date, required: true, default: Date.now },
  descripton: { type: String },
});

module.exports = mongoose.model("Help", helpSchema);
