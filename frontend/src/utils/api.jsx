import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

export default api;

// Example calls:
// api.get("/hotels")
// api.post("/auth/login", { email, password })
// api.post("/bookings/create", { hotelId, roomId, checkIn, checkOut, guests, totalPrice })
