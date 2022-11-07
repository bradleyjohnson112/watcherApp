const express = require("express");
const {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/loginController");
const { protectRoute } = require("../auth/protect");

const router = express.Router();

router.get("/register", registerView);
router.post("/register", registerUser);
router.get("/login", loginView);
router.post("/login", loginUser);
router.get("/logout", protectRoute, logoutUser);

module.exports = router;
