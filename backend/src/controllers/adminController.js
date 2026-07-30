const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");
const Booking = require("../models/bookingModel");

// ================= Dashboard Stats =================
async function getDashboardStats(req, res) {
  const [
    totalHotels,
    totalUsers,
    totalBookings,
    activeBookings,
    cancelledBookings,
    revenueAgg,
  ] = await Promise.all([
    Hotel.countDocuments(),
    User.countDocuments({ role: "user" }),
    Booking.countDocuments(),
    Booking.countDocuments({
      bookingStatus: { $in: ["Pending", "Confirmed"] },
    }),
    Booking.countDocuments({ bookingStatus: "Cancelled" }),
    Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  return res.status(200).send({
    success: true,
    data: {
      totalHotels,
      totalUsers,
      totalBookings,
      activeBookings,
      cancelledBookings,
      revenue,
    },
  });
}

module.exports = {
  getDashboardStats,
};
