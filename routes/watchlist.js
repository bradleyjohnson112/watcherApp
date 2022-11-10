const express = require("express");
const {
  watchlistView,
  deleteShow,
} = require("../controllers/showsController");
const { protectRoute } = require("../auth/protect");

const router = express.Router();

router.use(protectRoute);

router.get("/watchlist", watchlistView);
router.get("/shows/remove/:id", deleteShow);

module.exports = router;
