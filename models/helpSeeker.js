const mongoose = require("mongoose");

const helpSeekerSchema = mongoose.Schema({
  name: { first: String, last: { type: String, trim: true } },
  address: { type: String, required: true },
  profilePic: {
    type: Buffer,
    required: true,
  },
  profilePicType: {
    type: String,
    required: true,
  },
  helpDesired: { type: String, required: true },
  preferredDate: { type: Date, required: true, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// prettier-ignore
helpSeekerSchema.virtual("profilePicPath").get(function () {
  if (this.profilePic != null && this.profilePicType != null) {
    return `data:${this.profilePicType};charset=utf-8;base64,${this.profilePic.toString("base64")}`;
  }
});

module.exports = mongoose.model("HelpSeeker", helpSeekerSchema);
