const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");

// ================= Create Booking =================
async function createBooking(req, res) {
  const data = req.body;

  const {
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalPrice,
  } = data;

  const userId = req.user._id;

  // Check Required Fields
  if (
    !hotelId ||
    !roomId ||
    !checkIn ||
    !checkOut ||
    !guests ||
    !totalPrice
  ) {
    return res.status(400).send({
      success: false,
      message: "All Required Fields are Missing",
    });
  }

  // Check if room exists
  const roomData = await Room.findById(roomId);

  if (!roomData) {
    return res.status(404).send({
      success: false,
      message: "Room Not Found",
    });
  }

  // Check Room Availability
  if (!roomData.available) {
    return res.status(400).send({
      success: false,
      message: "Room is Not Available",
    });
  }

  // Generate Booking Number
  const bookingNumber =
  "BK-" +
  Date.now() +
  Math.floor(Math.random() * 1000);
  
  // Create Booking
  const newBookingData = new Booking({
    bookingNumber,
    userId,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalPrice,
  });

  const booking = await newBookingData.save();

  // Make Room Unavailable
  roomData.available = false;
  await roomData.save();

  return res.status(201).send({
    success: true,
    message: "Booking Created Successfully",
    data: booking,
  });
}

// ================= Get All Bookings =================
async function getAllBookings(req, res) {

  const bookings = await Booking.find({})
    .populate("userId")
    .populate("hotelId")
    .populate("roomId");

  return res.status(200).send({
    success: true,
    message: "Bookings Found",
    data: bookings,
  });
}

// ================= Get User Bookings =================
async function getMyBookings(req, res) {

  const userId = req.user._id;

  const bookings = await Booking.find({ userId })
    .populate("hotelId")
    .populate("roomId");

  return res.status(200).send({
    success: true,
    data: bookings,
  });
}

// ================= Get Single Booking =================
async function getSingleBooking(req, res) {

  const bookingId = req.params.bookingId;

  const booking = await Booking.findById(bookingId)
    .populate("userId")
    .populate("hotelId")
    .populate("roomId");

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    data: booking,
  });
}

// ================= Update Booking =================
async function updateBooking(req, res) {

  const data = req.body;

  const {
    bookingId,
    paymentStatus,
    bookingStatus,
  } = data;

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus,
      bookingStatus,
    },
    { new: true }
  );

  if (!updatedBooking) {
    return res.status(404).send({
      success: false,
      message: "Booking Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Booking Updated Successfully",
    data: updatedBooking,
  });
}

// ================= Cancel Booking =================
async function cancelBooking(req, res) {

  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking Not Found",
    });
  }

  // Only the booking owner or an admin can cancel it
  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send({
      success: false,
      message: "You Are Not Authorized to Cancel This Booking",
    });
  }

  // Make room available again
  await Room.findByIdAndUpdate(
    booking.roomId,
    {
      available: true,
    }
  );

  // Mark Booking as Cancelled (kept in history rather than deleted)
  booking.bookingStatus = "Cancelled";
  await booking.save();

  return res.status(200).send({
    success: true,
    message: "Booking Cancelled Successfully",
    data: booking,
  });
}

// ================= Delete Booking (Admin) =================
async function deleteBooking(req, res) {

  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).send({
      success: false,
      message: "Booking Not Found",
    });
  }

  await Booking.findByIdAndDelete(bookingId);

  return res.status(200).send({
    success: true,
    message: "Booking Deleted Successfully",
  });
}

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
};