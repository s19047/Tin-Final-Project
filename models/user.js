const mongoose = require("mongoose");
var mongooseTypePhone = require("mongoose-type-phone");

// roles: V - volunteer, H - Help Seeker, A - Admin
var roles = ["V", "H", process.env.ADMIN_CODE];

const userSchema = mongoose.Schema(
  {
    phone: { type: String, required: true },
    password: { type: String, required: true },

    name: { first: String, last: { type: String, trim: true } },

    address: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    profilePic: {
      type: Buffer,
      required: true,
    },
    profilePicType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// prettier-ignore
userSchema.virtual("profilePicPath").get(function () {
  if (this.profilePic != null && this.profilePicType != null) {
    return `data:${this.profilePicType};charset=utf-8;base64,${this.profilePic.toString("base64")}`;
  }
});
module.exports = mongoose.model("User", userSchema);
