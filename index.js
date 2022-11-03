const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { protectRoute } = require("./auth/protect");

const app = express();
dotenv.config();
loginCheck(passport);

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOLAB_URI,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/login"));
app.use("/", require("./routes/search"));
app.use("/", require("./routes/watchlist"));
app.use("/", require("./routes/profile"));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/watchlist");
  }
  res.redirect("/login");
});

mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }, () => {
  console.log("Connected to db");

  app.listen(3000, () => console.log("Server up and running"));
});
