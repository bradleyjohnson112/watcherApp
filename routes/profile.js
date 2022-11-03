const express = require("express");
const { profileView } = require("../controllers/showsController");

const router = express.Router();

router.get("/profile", profileView);

module.exports = router;
