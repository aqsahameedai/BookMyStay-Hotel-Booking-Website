const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Deluxe", "Suite"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
