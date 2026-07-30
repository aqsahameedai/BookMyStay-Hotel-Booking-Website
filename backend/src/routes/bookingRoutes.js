const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

// Create Booking (logged-in user)
router.post("/create", asyncHandler(authMiddleware), asyncHandler(createBooking));

// Get All Bookings (Admin only)
router.get(
  "/",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(getAllBookings)
);

// Get Logged-in User's Bookings
router.get("/my-bookings", asyncHandler(authMiddleware), asyncHandler(getMyBookings));

// Get Single Booking (logged-in user)
router.get("/:bookingId", asyncHandler(authMiddleware), asyncHandler(getSingleBooking));

// Update Booking Status (Admin only)
router.put(
  "/update",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(updateBooking)
);

// Cancel Booking (logged-in user, or admin)
router.delete("/cancel", asyncHandler(authMiddleware), asyncHandler(cancelBooking));

// Delete Booking Permanently (Admin only)
router.delete(
  "/delete",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(deleteBooking)
);

module.exports = router;
