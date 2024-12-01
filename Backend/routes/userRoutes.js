const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", protect, userController.getUser);
router.get("/:userId/details", async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDetails = await userController.getUserDetails(userId);
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;
