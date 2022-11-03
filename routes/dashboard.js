const express = require("express");
const { protectRoute } = require("../auth/protect");
const { dashboardView } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/dashboard", dashboardView);

module.exports = router;
