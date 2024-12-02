const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  badges: [{ type: String }],
  avatar: { type: String, default: "https://static.vecteezy.com/system/resources/previews/002/002/403/large_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" },
  role: { type: String, enum: ["admin", "student"], default: "student" },
});

module.exports = mongoose.model("User", userSchema);
