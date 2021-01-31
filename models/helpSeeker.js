const mongoose = require("mongoose");

const helpSeekerSchema = mongoose.Schema({
  address: { type: String, required: true },
  helpDesired: { type: String, required: true },
  preferredDate: { type: Date, required: true, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("HelpSeeker", helpSeekerSchema);
