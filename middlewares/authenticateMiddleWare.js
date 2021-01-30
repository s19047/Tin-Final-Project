const jwst = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.TOKEN_KEY);

    req.user = decode;
    next();
  } catch (error) {
    //authentication ailed
  }
};

module.exports = authenticate;
