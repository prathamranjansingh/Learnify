// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

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



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
   
    const user = await User.findById(userId).select("username email avatar");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const enrollments = await Enrollment.find({ studentId: userId }).populate("courseId", "title");

    const courses = enrollments.map((enrollment) => ({
      id: enrollment.courseId._id,
      name: enrollment.courseId.title,
      progress: enrollment.progress,
    }));

    // Calculate completed and total courses
    const completedCourses = courses.filter((course) => course.progress === 100).length;
    const totalCourses = courses.length;

    // Construct user profile response
    const userProfile = {
      name: user.username,
      email: user.email,
      avatar: user.avatar,
      completedCourses,
      totalCourses,
      courses,
    };

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};




