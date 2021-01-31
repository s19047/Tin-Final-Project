if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 3000;

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const app = express();

//passport stuff
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (phone) => users.find((user) => user.phone === phone),
  (id) => users.find((user) => user.id === id)
);

const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const volunteerRouter = require("./routes/volunteer");
const helpSeekerRouter = require("./routes/helpSeeker");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: false }));

//passport
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.TOKEN_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

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

app.listen(PORT);
