const express = require("express");
const router = express.Router();

const {
  addRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");

// Add Room (Admin only)
router.post(
  "/add",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(addRoom)
);

// Get All Rooms (public - can filter by hotelId via query param)
router.get("/", asyncHandler(getAllRooms));

// Get Single Room (public)
router.get("/:roomId", asyncHandler(getSingleRoom));

// Update Room (Admin only)
router.put(
  "/update",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(updateRoom)
);

// Delete Room (Admin only)
router.delete(
  "/delete",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(deleteRoom)
);

module.exports = router;
