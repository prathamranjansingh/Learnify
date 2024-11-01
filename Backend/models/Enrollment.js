const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  xp: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
