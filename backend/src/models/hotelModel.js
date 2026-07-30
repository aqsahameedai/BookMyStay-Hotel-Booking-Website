const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true},
);
const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
