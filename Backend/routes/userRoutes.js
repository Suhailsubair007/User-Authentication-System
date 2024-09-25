// userRoutes.js
const express = require("express");
const router = express.Router();
const {
  signupUser,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  getUserDetails,
} = require("../controller/userController");
const { verifyUser } = require("../middleware/authMiddleware");
const { upload } = require("../config/multer");

// User signup
router.post(
  "/signup",
  upload.single("profilePicture"),
  signupUser
);


// User login
router.post("/login", login);

// User Logout
router.post("/logout", verifyUser, logout);

// Get user profile details
router.get("/profile", verifyUser, getUserProfile);

router.get("/:id", verifyUser, getUserDetails);

// Update user profile
router.put(
  "/update_profile",
  verifyUser,
  upload.single("image"),
 updateUserProfile
);



module.exports = router;
