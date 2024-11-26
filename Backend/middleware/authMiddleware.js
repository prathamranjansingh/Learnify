const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin"); 


exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token, return unauthorized
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id) || await Admin.findById(decoded.id); // Check both User and Admin
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed", error: error.message });
  }
};


exports.isAdmin = (req, res, next) => {
    if (req.user instanceof Admin) {      
      return next();
    }
    res.status(403).json({ message: "Access denied" });
  };
