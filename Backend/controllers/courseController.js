// controllers/courseController.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Create course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, youtubeLinks, duration, category, difficulty } = req.body;
    const course = await Course.create({ title, description, youtubeLinks, duration, category, difficulty, author: req.user.id });
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("author", "username");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

// Enroll student in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.create({ studentId: req.user.id, courseId });
    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
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
    res.status(500).json({ error: "Failed to retrieve enrolled students" });
  }
};
