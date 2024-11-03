// controllers/courseController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User"); // Import User model for XP update
const jwt = require('jsonwebtoken');
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
    const { courseId, videoIndex } = req.params; 
    const course = await Course.findById(courseId);

    if (!course || !course.videos[videoIndex]) {
      return res.status(404).json({ error: "Course or video not found" });
    }


    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.xp += course.xpPerVideo; 
    await user.save();

    res.status(200).json({ message: "Video completed", xpEarned: course.xpPerVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete video" });
  }
};

// Get details of a specific course
// Get details of a specific course
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params; // Extract courseId from parameters

    // Find the course by ID and populate the author field
    const course = await Course.findById(courseId);
    
    // Check if the course exists
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let isEnrolled = false;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
      
      // Check if the user is enrolled
      isEnrolled = await Enrollment.exists({
        studentId: decoded.id, // Use the decoded user ID from token
        courseId: courseId,
      });
    }

    // Return the course and enrollment status
    res.json({ course, isEnrolled });

  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve course details" });
  }
};

