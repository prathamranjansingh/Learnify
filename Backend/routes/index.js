const express = require("express");
const router = express.Router();

// Import routes
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const quizRoutes = require("./quizRoutes");
const gamificationRoutes = require("./gamificationRoutes");

// Mount each route module to a specific path
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/quizzes", quizRoutes);
router.use("/gamification", gamificationRoutes);

module.exports = router;
