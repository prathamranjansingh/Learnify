const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeLinks: [{ type: String, required: true }],
  duration: { type: Number },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
  difficulty: { type: String },
});

module.exports = mongoose.model("Course", courseSchema);
