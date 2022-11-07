const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const loginCheck = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Check customer
      User.findOne({ email: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            // console.log("wrong email");
            return done();
          }

          //Match Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              // console.log("Wrong password");
              return done();
            }
          });
        })
        .catch((err) => {
          throw err;
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      // .populate("shows")
      .exec((err, user) => {
        done(err, user);
      });
  });
};
module.exports = {
  loginCheck,
};
