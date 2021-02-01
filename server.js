if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const app = express();

const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const volunteerRouter = require("./routes/volunteer");
const helpSeekerRouter = require("./routes/helpSeeker");
const helpRouter = require("./routes/help");

const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: false }));
app.use(
  session({
    name: "server-session-cookie-id",
    secret: process.env.TOKEN_KEY,
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: false,
      maxAge: 2160000000,
      httpOnly: false,
    },
  })
);

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database successfuly."));

app.use("/", indexRouter);
app.use("/volunteer", volunteerRouter);
app.use("/helpSeeker", helpSeekerRouter);
app.use("/register", registerRouter);
app.use("/help", helpRouter);
app.use("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("../");
});

app.listen(PORT);
