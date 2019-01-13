const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 60
  },
  body: {
    type: String,
    required: true,
    trim: true,
    min: 100
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("post", PostSchema);
