const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/adminController");
const router = express.Router();

// Register Admin
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginAdmin);

module.exports = router;
