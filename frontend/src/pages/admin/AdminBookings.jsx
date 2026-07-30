import { useEffect, useState } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import "./AdminBookings.css";
import api from "../../utils/api";

const statuses = ["Pending", "Confirmed", "Cancelled", "Completed"];

function AdminBookings() {
  const [bookingsData, setBookingsData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  async function getData() {
    try {
      const response = await api.get("/bookings");
      const res = response.data;
      if (res?.success) {
        setBookingsData(res.data);
      }
    } catch (err) {
      alert("Error In Fetching Bookings!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleStatusChange(bookingId, bookingStatus) {
    try {
      const response = await api.put("/bookings/update", { bookingId, bookingStatus });
      if (response.data?.success) {
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not update booking");
      console.log(err);
    }
  }

  async function handlePaymentChange(bookingId, paymentStatus) {
    try {
      const response = await api.put("/bookings/update", { bookingId, paymentStatus });
      if (response.data?.success) {
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not update payment");
      console.log(err);
    }
  }

  async function deleteBooking(bookingId) {
    const confirmDelete = window.confirm("Permanently delete this booking?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete("/bookings/delete", { data: { bookingId } });
      if (response.data?.success) {
        alert("Booking Deleted");
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete booking");
      console.log(err);
    }
  }

  const filteredBookings = bookingsData.filter((b) => {
    const matchesSearch =
      !search ||
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.hotelId?.hotelName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section className="adminBookings">
      <div className="bookingsHeader">
        <h1>Bookings</h1>
      </div>

      <div className="filterRow">
        <div className="searchBox">
          <FaSearch />
          <input
            placeholder="Search by booking #, guest, or hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Booking</th>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.bookingNumber}</td>
                <td>
                  {booking.userId?.name}
                  <br />
                  <span className="subText">{booking.userId?.email}</span>
                </td>
                <td>{booking.hotelId?.hotelName || "—"}</td>
                <td>
                  {new Date(booking.checkIn).toLocaleDateString()}
                  <br />→ {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td>₹ {booking.totalPrice?.toLocaleString()}</td>
                <td>
                  <select
                    value={booking.paymentStatus}
                    onChange={(e) => handlePaymentChange(booking._id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                  </select>
                </td>
                <td>
                  <select
                    className={`status ${booking.bookingStatus}`}
                    value={booking.bookingStatus}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="deleteBtn" onClick={() => deleteBooking(booking._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminBookings;
