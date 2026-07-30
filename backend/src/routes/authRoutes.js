const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  getAllUsers,
} = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

// Register
router.post("/register", asyncHandler(register));

// Login
router.post("/login", asyncHandler(login));

// Get Logged-in User
router.get("/me", asyncHandler(authMiddleware), asyncHandler(getMe));

// Update Profile
router.put("/update-profile", asyncHandler(authMiddleware), asyncHandler(updateProfile));

// Get All Users (Admin only)
router.get(
  "/users",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(getAllUsers)
);

// Logout
router.get("/logout", asyncHandler(logout));

module.exports = router;
