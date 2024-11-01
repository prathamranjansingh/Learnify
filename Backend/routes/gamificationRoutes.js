const express = require("express");
const router = express.Router();
const gamificationController = require("../controllers/gamificationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/award-xp", protect, gamificationController.awardXP);
router.get("/leaderboard/:courseId", gamificationController.getLeaderboard);

module.exports = router;
