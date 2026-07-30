const express = require("express");
const router = express.Router();

const {
  addHotel,
  getAllHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminMiddleware = require("../middlewares/checkAdminMiddleware");
const upload = require("../utils/upload");

// Add Hotel (Admin only)
router.post(
  "/add",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  upload.array("images", 5),
  asyncHandler(addHotel)
);

// Get All Hotels (public - supports search/filter/sort via query params)
router.get("/", asyncHandler(getAllHotels));

// Get Single Hotel (public)
router.get("/:hotelId", asyncHandler(getSingleHotel));

// Update Hotel (Admin only)
router.put(
  "/update",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  upload.array("images", 5),
  asyncHandler(updateHotel)
);

// Delete Hotel (Admin only)
router.delete(
  "/delete",
  asyncHandler(authMiddleware),
  asyncHandler(checkAdminMiddleware),
  asyncHandler(deleteHotel)
);

module.exports = router;
