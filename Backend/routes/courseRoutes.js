const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isAdmin, courseController.createCourse);
router.get("/", courseController.getCourses);
router.post("/:courseId/enroll", protect, courseController.enrollCourse);
router.get("/:courseId/students", protect, isAdmin, courseController.getEnrolledStudents);
router.get('/:courseId', courseController.getCourseDetails);
router.post("/:courseId/videos/:videoId/complete", protect, courseController.completeVideo);

module.exports = router;
