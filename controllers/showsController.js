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
  getAllShows(req, res);
};

// Profile view
const profileView = (req, res) => {
  res.render("profile");
};

// Get all shows
const getAllShows = async (req, res) => {
  const user = await User.findById(req.user._id).populate("shows");
  let shows = user.shows;

  const showRequests = [];
  for (let i = 0; i < shows.length; i++) {
    const url = `https://api.tvmaze.com/shows/${shows[i].apiId}`;
    const req = axios.get(url);
    showRequests.push(req);
  }

  Promise.all(showRequests)
    .then((responses) => {
      shows = responses.map((res) => res.data);
      const showLinksRequests = [];
      for (let i = 0; i < shows.length; i++) {
        const keys = Object.keys(shows[i]._links);
        for (let y = 0; y < keys.length; y++) {
          if (keys[y] !== "self") {
            const url = shows[i]._links[keys[y]].href;
            const req = axios.get(url).then((res) => {
              shows[i]._links[keys[y]] = res.data;
            });

            showLinksRequests.push(req);
          }
        }
      }

      return Promise.all(showLinksRequests);
    })
    .then(() => {
      res.render("watchlist", { user: req.user, shows: shows });
    });
};

// Post request that handles creating a show
const createShow = async (req, res) => {
  try {
    // Get current user
    const user = req.user;
    console.log(user);

    // Get show
    const { title, apiId } = req.body;
    console.log(title);
    console.log(apiId);

    // Check if show already exists
    if (await Show.findOne({ apiId: apiId, user: req.user._id })) {
      console.log("show already added");
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
    console.log(err);
    res.send(err);
  }
};

const deleteShow = async (req, res) => {
  const user = req.user;
  const apiId = req.params.id;
  console.log(user);
  console.log(user.shows);

  try {
    const show = await Show.findOne({ apiId: apiId, user: req.user._id });

    console.log(show._id);
    user.shows = user.shows.filter(
      (showId) => showId.toString() !== show._id.toString()
    );
    console.log(user.shows);
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
  getAllShows,
  deleteShow,
};
