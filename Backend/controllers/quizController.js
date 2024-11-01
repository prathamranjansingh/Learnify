// controllers/quizController.js
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");

// Create a quiz for a course
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, questions } = req.body;
    const quiz = await Quiz.create({ courseId, questions });
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Submit quiz and update XP for student
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) score += 10; // each correct answer gives 10 XP
    });

    const enrollment = await Enrollment.findOneAndUpdate(
      { studentId: req.user.id, courseId: quiz.courseId },
      { $inc: { xp: score } },
      { new: true }
    );

    res.json({ message: "Quiz submitted", score, enrollment });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};
