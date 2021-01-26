const mongoose = require("mongoose");
var mongooseTypePhone = require("mongoose-type-phone");

const helpSeekerSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: mongoose.SchemaTypes.Phone, required: true },
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
});

helpSeekerSchema.virtual("profilePicPath").get(function () {
  if (this.profilePic != null && this.profilePicType != null) {
    return `data:${
      this.profilePicType
    };charset=utf-8;base64,${this.profilePicType.toString("base64")}`;
  }
});

module.exports = mongoose.model("HelpSeeker", helpSeekerSchema);
