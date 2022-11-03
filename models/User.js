const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  shows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
