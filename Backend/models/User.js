const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  badges: [{ type: String }],
  role: { type: String, enum: ["admin", "student"], default: "student" },
});

module.exports = mongoose.model("User", userSchema);
