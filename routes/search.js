const express = require("express");
const { searchView, createShow } = require("../controllers/showsController");
const { protectRoute } = require("../auth/protect");

const router = express.Router();

router.use(protectRoute);

router.get("/search", searchView);
router.post("/shows", createShow);

module.exports = router;
