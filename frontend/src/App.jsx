import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const loc = window.location.pathname;
  const isAdminRoute = loc.includes("admin");

  return (
    <BrowserRouter>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hotels/:hotelId" element={<HotelDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
