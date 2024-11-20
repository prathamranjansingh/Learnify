const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const UserVideoProgress = require("../models/UserVideoProgress"); // For video progress
const jwt = require('jsonwebtoken');

// Helper to find course by ID
async function findCourseById(courseId) {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  return course;
}

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, videos, duration, category, difficulty, xpPerVideo, imageUrl } = req.body;

    // Validate input
    if (!title || !videos || videos.length === 0 || !videos.every(v => v.title && v.url)) {
      return res.status(400).json({ error: "Title and valid videos are required" });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const course = await Course.create({
      title,
      description,
      videos,
      duration,
      category,
      difficulty,
      author: req.user.id,
      xpPerVideo: xpPerVideo ?? 10, // Default value
      imageUrl, // Add the imageUrl field
    });

    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create course" });
  }
};


// Get all courses (with pagination)
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const courses = await Course.find()
      .populate("author", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await findCourseById(courseId);

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

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

// Get enrolled students for a course
exports.getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrolledStudents = await Enrollment.find({ courseId })
      .populate("studentId", "username");

    res.json(enrolledStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve enrolled students" });
  }
};


exports.completeVideo = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    const course = await findCourseById(courseId);


    const video = course.videos.find(v => v._id.toString() === videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Update video progress
    const progress = await UserVideoProgress.findOneAndUpdate(
      { userId: req.user.id, courseId, videoId },
      { progress: 'completed' },
      { new: true, upsert: true }
    );

    // Award XP to user
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


exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch the course and its author details
    const course = await Course.findById(courseId).populate("author", "username");
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let isEnrolled = false;

    // Check if the user is authenticated
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is enrolled in the course
        isEnrolled = await Enrollment.exists({
          studentId: decoded.id,
          courseId,
        });

        // If the user is enrolled, update the video completion status
        if (isEnrolled) {
          const updatedVideos = await Promise.all(
            course.videos.map(async (video) => {
              const progress = await UserVideoProgress.findOne({
                userId: decoded.id,
                courseId,
                videoId: video._id,
              });

              // Explicitly define completed status
              return {
                ...video.toObject(),
                completed: progress?.progress === "completed", // Add the completed property
              };
            })
          );

          course.videos = updatedVideos; // Replace the videos array
        }
      } catch (err) {
        console.warn("Invalid or expired token:", err);
      }
    }

    res.json({
      course: {
        ...course.toObject(), // Convert the Mongoose document to a plain object
        videos: course.videos, // Updated videos with `completed` status
      },
      isEnrolled,
    });
  } catch (error) {
    console.error("Error retrieving course details:", error);
    res.status(500).json({ error: "Failed to retrieve course details" });
  }
};
