const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isAdmin, quizController.createQuiz);
router.post("/submit", protect, quizController.submitQuiz);

module.exports = router;
