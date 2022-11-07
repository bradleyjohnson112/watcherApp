const express = require("express");
const { protectRoute } = require("../auth/protect");
const { profileView } = require("../controllers/showsController");

const router = express.Router();

router.use(protectRoute);

router.get("/profile", profileView);

module.exports = router;
