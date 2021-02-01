const mongoose = require("mongoose");

const helpSeekerSchema = mongoose.Schema({
  helpDesired: { type: String, required: true },
  preferredDate: { type: Date, required: true, default: Date.now },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("HelpSeeker", helpSeekerSchema);
