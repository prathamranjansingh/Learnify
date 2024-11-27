const Enrollment = require("../models/Enrollment");


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


exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch enrollments for the specific course
    const leaderboard = await Enrollment.find({ courseId })
      .sort({ xp: -1 }) // Sort by xp in descending order
      .limit(10) // Limit the results to top 10
      .populate("studentId", "username") // Populate the student details (username)
      .exec();

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
};
