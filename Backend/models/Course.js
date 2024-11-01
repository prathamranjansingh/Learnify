const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videos: [VideoSchema], // Playlist of videos, each with a title and URL
  duration: { type: Number }, // Total duration of the course
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
  difficulty: { type: String },
  xpPerVideo: { type: Number, default: 10 }, // XP awarded for completing each video
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
