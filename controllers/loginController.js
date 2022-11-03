const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Register view
const registerView = (req, res) => {
  console.log(req.user);
  res.render("register", { err: null });
};

// Post request that handles register
const registerUser = (req, res) => {
  const { username, email, password, confirm } = req.body;

  // Check all user input exists
  if (!username || !email || !password || !confirm) {
    res.render("register", {
      username,
      email,
      password,
      confirm,
      err: "Fill empty fields",
    });
  } else if (password !== confirm) {
    res.render("register", {
      username,
      email,
      password,
      confirm,
      err: "Password must match",
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        res.render("register", {
          username,
          email,
          password,
          confirm,
          err: "User with that email already exists, try Logging in",
        });
      }

      // Create new user
      const newUser = new User({
        username,
        email,
        password,
      });

      // Hash password
      bcrypt
        .hash(newUser.password, 10)
        .then((hash) => {
          // Save user to db
          newUser.password = hash;
          return newUser.save();
        })
        .then(() => res.redirect("/login"))
        .catch((err) =>
          res.render("register", {
            username,
            email,
            password,
            confirm,
            err: err,
          })
        );
    });
  }
};

// Login view
const loginView = (req, res) => {
  res.render("login", { err: null });
};

// Post request that handles login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    res.render("login", {
      email,
      password,
      err: "Please fill in all the fields",
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/watchlist",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  }
};

// Logout
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
};
