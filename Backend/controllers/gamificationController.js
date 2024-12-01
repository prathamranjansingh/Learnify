const Enrollment = require("../models/Enrollment");
const Quiz = require("../models/Quiz")

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

    const leaderboard = await Enrollment.find({ courseId })
      .populate("studentId", "username") 
      .exec();

    const leaderboardWithScores = await Promise.all(
      leaderboard.map(async (entry) => {
        const studentId = entry.studentId._id;

        const quizzes = await Quiz.find({ courseId })
          .exec();

        let totalScore = 0;
        quizzes.forEach((quiz) => {
          const attempt = quiz.attempts.find((attempt) => attempt.userId.toString() === studentId.toString());
          if (attempt) {
            totalScore += attempt.score; 
          }
        });

        return {
          ...entry.toObject(),
          totalScore: totalScore,
        };
      })
    );

    
    leaderboardWithScores.sort((a, b) => (b.totalScore) - (a.totalScore));

    res.json(leaderboardWithScores);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
};
