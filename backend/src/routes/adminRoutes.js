const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/adminController");
const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

// Get Dashboard Stats (Admin only)
router.get(
  "/stats",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(getDashboardStats)
);

module.exports = router;
