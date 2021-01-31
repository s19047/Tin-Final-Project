const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PictureUploadController = require("../controllers/PictureUploadController");
require("express-validator/check");

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
      address: req.body.address,
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

const login = async (req, res, next) => {
  //parameters to send
  const params = {
    req: req,
  };

  var phone = req.body.phone;
  var password = req.body.password;

  const user = await User.findOne({ phone: phone });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.log(err);
      } else if (result) {
        let token = jwt.sign({ phone: user.phone }, process.env.TOKEN_KEY, {
          expiresIn: "1h",
        });

        console.log(token);
        // send token
        res.json(token);
      } else {
        params.errorMsg = "password does not match";
        res.render("index", params);
      }
    });
  } else {
    params.errorMsg = "no user with the that number was found";
    res.render("index", params);
  }
};
module.exports = {
  register,
  login,
};
