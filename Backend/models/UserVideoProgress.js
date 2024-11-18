const mongoose = require("mongoose");

const UserVideoProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  progress: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model("UserVideoProgress", UserVideoProgressSchema);
