const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectToDB = require("./config/connectToDB");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

connectToDB();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin", adminRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});