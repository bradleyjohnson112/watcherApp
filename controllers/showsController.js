const { session } = require("passport");
const Show = require("../models/Show");
const User = require("../models/User");
const axios = require("axios");
const { get } = require("mongoose");

// Search view
const searchView = async (req, res) => {
  res.render("search", { user: req.user });
};

// Watchlist view
const watchlistView = async (req, res) => {
  const user = await User.findById(req.user._id).populate("shows");
  res.render("watchlist", { user: user });
};

// Profile view
const profileView = (req, res) => {
  res.render("profile");
};

// Post request that handles creating a show
const createShow = async (req, res) => {
  try {
    // Get current user
    const user = req.user;

    // Get show
    const { title, apiId } = req.body;

    // Check if show already exists
    if (await Show.findOne({ apiId: apiId, user: req.user._id })) {
      res.send("show already added");
    } else {
      // Create Show
      const show = await Show.create({
        title: title,
        apiId: apiId,
        user: req.user._id,
      });

      // Push show _id to users shows array
      user.shows.push(show._id);

      // Save updated user
      await user.save();

      res.send("Ok");
    }
  } catch (err) {
    res.send(err);
  }
};

const deleteShow = async (req, res) => {
  const user = req.user;
  const apiId = req.params.id;

  try {
    const show = await Show.findOne({ apiId: apiId, user: req.user._id });

    user.shows = user.shows.filter(
      (showId) => showId.toString() !== show._id.toString()
    );

    await show.remove();
    await user.save();

    res.redirect("/watchlist");
  } catch (err) {
    res.redirect("/watchlist");
  }
};

module.exports = {
  searchView,
  watchlistView,
  profileView,
  createShow,
  deleteShow,
};
