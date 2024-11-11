// controllers/quizController.js
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const jwt = require("jsonwebtoken");
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

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    const existingAttempt = quiz.attempts.find(attempt => attempt.userId.toString() === userId);
    
    if (existingAttempt) {
      return res.status(400).json({ error: "You have already attempted this quiz" });
    }

    let score = 0;
    quiz.questions.forEach((question) => {
      if (question.correctAnswer === answers[question._id]) score += 10; // Each correct answer gives 10 XP
    });

    quiz.attempts.push({ userId, score });
    await quiz.save();


    const enrollment = await Enrollment.findOneAndUpdate(
      { studentId: userId, courseId: quiz.courseId },
      { $inc: { xp: score } },
      { new: true }
    );

    res.json({ message: "Quiz submitted", score, enrollment });
  } catch (error) {
    console.error("Failed to submit quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

exports.getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch the quiz for the course
    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course" });
    }

    // Check for the authorization token and if the user has attempted the quiz
    let userAttempted = false;
    let userScore = 0; // Initialize the userScore variable properly here
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded:", decoded);

      
      const userAttempt = quiz.attempts.find(attempt => attempt.userId.toString() === decoded.id);
      console.log(userAttempt);
      
      if (userAttempt) {
        userAttempted = true;
        userScore = userAttempt.score; 
      }
    }

    res.json({ quiz, userAttempted, userScore });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};
