const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  apiId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Show", showSchema);
