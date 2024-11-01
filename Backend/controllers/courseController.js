// controllers/courseController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User"); // Import User model for XP update

// Create course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, videos, duration, category, difficulty, xpPerVideo } = req.body;
    
    // Validate the input data
    if (!title || !videos || videos.length === 0) {
      return res.status(400).json({ error: "Title and videos are required" });
    }

    const course = await Course.create({
      title,
      description,
      videos,
      duration,
      category,
      difficulty,
      author: req.user.id,
      xpPerVideo: xpPerVideo || 10, // Default to 10 if not provided
    });

    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("author", "username");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

// Enroll student in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create an enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
    });

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

// Get enrolled students for a course (admin only)
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrolledStudents = await Enrollment.find({ courseId }).populate("studentId", "username");
    res.json(enrolledStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve enrolled students" });
  }
};

// Complete a video and award XP
exports.completeVideo = async (req, res) => {
  try {
    const { courseId, videoIndex } = req.params; // Get courseId and videoIndex from params
    const course = await Course.findById(courseId);

    if (!course || !course.videos[videoIndex]) {
      return res.status(404).json({ error: "Course or video not found" });
    }

    // Assuming req.user contains the current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Increase the user's XP
    user.xp += course.xpPerVideo; // Increment user's XP by xpPerVideo
    await user.save();

    res.status(200).json({ message: "Video completed", xpEarned: course.xpPerVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete video" });
  }
};
