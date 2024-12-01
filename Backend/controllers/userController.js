// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const UserVideoProgress = require("../models/UserVideoProgress");

// Register user
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Get user data
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user data" });
  }
};




exports.getUserDetails = async (userId) => {
  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Fetch user's enrolled courses
    const enrollments = await Enrollment.find({ studentId: userId }).populate("courseId");

    // Prepare enrolled courses data
    const enrolledCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = enrollment.courseId;

        // Fetch completed video progress for the course
        const completedVideos = await UserVideoProgress.countDocuments({
          userId,
          courseId: course._id,
          progress: "completed",
        });

        // Total lectures in the course
        const totalLectures = course.videos.length;

        return {
          id: course._id.toString(),
          title: course.title,
          instructor: course.author.toString(), // Assuming 'author' is populated with instructor name
          progress: Math.round((completedVideos / totalLectures) * 100),
          totalLectures,
          completedLectures: completedVideos,
          imageUrl: course.imageUrl,
        };
      })
    );

    // Example calculation of user stats
    const stats = {
      totalCoursesEnrolled: enrollments.length,
      totalHoursLearned: enrolledCourses.reduce((sum, course) => sum + (course.completedLectures * 1), 0), // Assuming 1 hour per lecture
      averageCourseRating: 4.7, // Placeholder, update based on ratings data
      certificatesEarned: enrolledCourses.filter((course) => course.progress === 100).length,
    };

    // Placeholder for recommended courses (can be derived using an algorithm)
    const recommendedCourses = await Course.find().limit(5).then((courses) =>
      courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        instructor: course.author.toString(), // Assuming 'author' is populated with instructor name
        progress: 0,
        totalLectures: course.videos.length,
        completedLectures: 0,
        imageUrl: course.imageUrl,
      }))
    );

    // Final user data
    const userData = {
      name: user.username,
      email: user.email,
      stats,
      enrolledCourses,
      recommendedCourses,
    };

    return userData;
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    throw error;
  }
};


