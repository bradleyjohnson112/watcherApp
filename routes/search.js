const express = require("express");
const { searchView, createShow } = require("../controllers/showsController");
const { protectRoute } = require("../auth/protect");
// const { tasksView } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/search", searchView);
router.post("/shows", createShow);

module.exports = router;
