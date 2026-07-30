import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import "./MyBookings.css";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

const IMAGE_API = import.meta.env.VITE_IMAGE_URL;

function MyBookings() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  async function getData() {
    try {
      const response = await api.get("/bookings/my-bookings");
      const res = response.data;
      if (res?.success) {
        setBookings(res.data);
      }
    } catch (err) {
      alert("Error In Fetching Bookings!!");
      console.log(err);
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  async function handleCancel(bookingId) {
    const confirmCancel = window.confirm("Cancel this booking?");
    if (!confirmCancel) return;

    try {
      const response = await api.delete("/bookings/cancel", { data: { bookingId } });
      if (response.data?.success) {
        alert("Booking Cancelled");
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not cancel booking");
      console.log(err);
    }
  }

  return (
    <section className="bookingsPage">
      <h1>My Bookings</h1>

      <div className="bookingsList">
        {bookings.length === 0 ? (
          <div className="emptyBookings">
            <h2>No bookings yet</h2>
            <p>Once you book a stay, it will show up here.</p>
            <Link to="/" className="browseBtn">
              Browse hotels
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div className="bookingCard" key={booking._id}>
              <img
                src={
                  booking.hotelId?.images?.[0]
                    ? IMAGE_API + booking.hotelId.images[0]
                    : "https://placehold.co/300x200/123832/f7f5ef?text=BookMyStay"
                }
                alt={booking.hotelId?.hotelName}
              />

              <div className="bookingInfo">
                <div className="bookingTitleRow">
                  <h3>{booking.hotelId?.hotelName || "Hotel"}</h3>
                  <span className={`status ${booking.bookingStatus}`}>
                    {booking.bookingStatus}
                  </span>
                </div>

                <p className="bookingMeta">
                  <FaMapMarkerAlt /> {booking.hotelId?.city} - Room{" "}
                  {booking.roomId?.roomNumber} ({booking.roomId?.roomType})
                </p>

                <p className="bookingMeta">
                  <FaCalendarAlt /> {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>

                <p className="bookingMeta">
                  <FaUserFriends /> {booking.guests} guest(s) - #{booking.bookingNumber}
                </p>
              </div>

              <div className="bookingActions">
                <p className="bookingPrice">₹ {booking.totalPrice?.toLocaleString()}</p>
                {["Pending", "Confirmed"].includes(booking.bookingStatus) && (
                  <button className="cancelBtn" onClick={() => handleCancel(booking._id)}>
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default MyBookings;
