const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PictureUploadController = require("../controllers/PictureUploadController");

const register = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }

    let user = new User({
      phone: req.body.phone,
      password: hashedPass,
      name: { first: req.body.firstName, last: req.body.lastName },
      role: req.body.role,
    });

    //Save profile picture to database
    PictureUploadController.savePicture(user, req.body.profilePic);

    user
      .save()
      .then((user) => {
        /*
        res.json({
          message: "User Added Successfully",
        });*/
        console.log("User Added Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const login = (req, res, next) => {
  var phone = req.body.phone;
  var password = req.body.password;

  const user = User.findOne({ phone: phone });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.log(err);
      } else if (result) {
        let token = jwt.sign({ phone: user.phone }, process.env.TOKEN_KEY, {
          expiresIn: "1h",
        });
        // send token
      } else {
        console.log("password doesn't match");
      }
    });
  } else {
    console.log("no user found");
  }
};
module.exports = {
  register,
  login,
};
