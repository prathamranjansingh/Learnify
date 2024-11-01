// controllers/gamificationController.js
const Enrollment = require("../models/Enrollment");

// Award XP for completing course or quiz
exports.awardXP = async (req, res) => {
  try {
    const { enrollmentId, xp } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { $inc: { xp } },
      { new: true }
    );
    res.status(200).json({ message: "XP awarded", enrollment });
  } catch (error) {
    res.status(500).json({ error: "Failed to award XP" });
  }
};

// Get leaderboard for a course
exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    const leaderboard = await Enrollment.find({ courseId })
      .sort({ xp: -1 })
      .limit(10)
      .populate("studentId", "username");
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
};
