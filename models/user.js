const mongoose = require("mongoose");
var mongooseTypePhone = require("mongoose-type-phone");

// roles: V - volunteer, H - Help Seeker, A - Admin
var roles = ["V", "H", process.env.ADMIN_CODE];

const userSchema = mongoose.Schema(
  {
    phone: { type: mongoose.SchemaTypes.Phone, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
