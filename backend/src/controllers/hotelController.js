const Hotel = require("../models/hotelModel");

// ================= Add Hotel =================
async function addHotel(req, res) {
  const data = req.body;

  const {
    hotelName,
    city,
    address,
    description,
    pricePerNight,
    rating,
    amenities,
  } = data;

  // Check Required Fields
  if (
    !hotelName ||
    !city ||
    !address ||
    !description ||
    !pricePerNight
  ) {
    return res.status(400).send({
      success: false,
      message: "All Required Fields are Missing",
    });
  }

  // Check if hotel already exists
  const hotelData = await Hotel.findOne({
    hotelName,
    city,
  });

  if (hotelData) {
    return res.status(400).send({
      success: false,
      message: "Hotel Already Exists",
    });
  }

  // Upload Images
  const images = req.files
    ? req.files.map((file) => file.path)
    : [];

  // Create Hotel
  const newHotelData = new Hotel({
    hotelName,
    city,
    address,
    description,
    pricePerNight,
    rating,
    amenities,
    images,
  });

  const newHotel = await newHotelData.save();

  return res.status(201).send({
    success: true,
    message: "Hotel Added Successfully",
    data: newHotel,
  });
}

// ================= Get All Hotels =================
async function getAllHotels(req, res) {

  const {
    search,
    city,
    minPrice,
    maxPrice,
    rating,
    sortBy,
    order,
    page,
    limit,
  } = req.query;

  const filter = {};

  if (search) {
    filter.hotelName = { $regex: search, $options: "i" };
  }

  if (city) {
    filter.city = { $regex: city, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }

  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  let sort = { createdAt: -1 };
  if (sortBy === "price") {
    sort = { pricePerNight: order === "desc" ? -1 : 1 };
  } else if (sortBy === "rating") {
    sort = { rating: order === "desc" ? -1 : 1 };
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const skip = (pageNum - 1) * limitNum;

  const [hotels, total] = await Promise.all([
    Hotel.find(filter).sort(sort).skip(skip).limit(limitNum),
    Hotel.countDocuments(filter),
  ]);

  return res.status(200).send({
    success: true,
    message: "Hotels Found",
    data: hotels,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
}

// ================= Get Single Hotel =================
async function getSingleHotel(req, res) {

  const hotelId = req.params.hotelId;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    return res.status(404).send({
      success: false,
      message: "Hotel Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    data: hotel,
  });
}

// ================= Update Hotel =================
async function updateHotel(req, res) {

  const data = req.body;

  const {
    hotelId,
    hotelName,
    city,
    address,
    description,
    pricePerNight,
    rating,
    amenities,
  } = data;

  let updateData = {
    hotelName,
    city,
    address,
    description,
    pricePerNight,
    rating,
    amenities,
  };

  // If new images uploaded
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map((file) => file.path);
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    hotelId,
    updateData,
    { new: true }
  );

  if (!updatedHotel) {
    return res.status(404).send({
      success: false,
      message: "Hotel Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Hotel Updated Successfully",
    data: updatedHotel,
  });
}

// ================= Delete Hotel =================
async function deleteHotel(req, res) {

  const { hotelId } = req.body;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    return res.status(404).send({
      success: false,
      message: "Hotel Not Found",
    });
  }

  await Hotel.findByIdAndDelete(hotelId);

  return res.status(200).send({
    success: true,
    message: "Hotel Deleted Successfully",
  });
}

module.exports = {
  addHotel,
  getAllHotels,
  getSingleHotel,
  updateHotel,
  deleteHotel,
};