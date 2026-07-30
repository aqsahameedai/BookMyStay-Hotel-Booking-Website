const Room = require("../models/roomModel");
//Add Room
async function addRoom(req, res) {
  const data = req.body;

  const { hotelId, roomNumber, roomType, capacity, price, available } = data;

  if (!hotelId || !roomNumber || !roomType || !capacity || !price) {
    return res.status(400).send({
      success: false,
      message: "All Required Fields are Missing",
    });
  }

  // Check if room already exists in same hotel
  const roomData = await Room.findOne({ hotelId,roomNumber });

  if (roomData) {
    return res.status(400).send({
      success: false,
      message: "Room Already Exists",
    });
  }

  const newRoomData = new Room({
    hotelId,
    roomNumber,
    roomType,
    capacity,
    price,
    available,
  });

  const newRoom = await newRoomData.save();

  return res.status(201).send({
    success: true,
    message: "Room Added Successfully",
    data: newRoom,
  });
}

// Get All Rooms
async function getAllRooms(req, res) {
  const { hotelId } = req.query;

  const filter = {};
  if (hotelId) {
    filter.hotelId = hotelId;
  }

  const rooms = await Room.find(filter).populate("hotelId");

  return res.status(200).send({
    success: true,
    message: "Rooms Found",
    data: rooms,
  });
}

//Get Single Room
async function getSingleRoom(req, res) {
  const roomId = req.params.roomId;

  const room = await Room.findById(roomId).populate("hotelId");

  if (!room) {
    return res.status(404).send({
      success: false,
      message: "Room Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    data: room,
  });
}

// Update Room
async function updateRoom(req, res) {
  const data = req.body;

  const { roomId, roomNumber, roomType, capacity, price, available } = data;

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    {
      roomNumber,
      roomType,
      capacity,
      price,
      available,
    },
    { new: true },
  );

  if (!updatedRoom) {
    return res.status(404).send({
      success: false,
      message: "Room Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Room Updated Successfully",
    data: updatedRoom,
  });
}

// Delete Room
async function deleteRoom(req, res) {
  const { roomId } = req.body;

  const room = await Room.findById(roomId);

  if (!room) {
    return res.status(404).send({
      success: false,
      message: "Room Not Found",
    });
  }

  await Room.findByIdAndDelete(roomId);

  return res.status(200).send({
    success: true,
    message: "Room Deleted Successfully",
  });
}

module.exports = {
  addRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
