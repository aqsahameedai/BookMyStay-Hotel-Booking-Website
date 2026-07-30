import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaUserFriends, FaBed, FaCheck } from "react-icons/fa";
import "./HotelDetails.css";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

const IMAGE_API = import.meta.env.VITE_IMAGE_URL;

function HotelDetails() {
  const { hotelId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function getData() {
    try {
      const hotelRes = await api.get(`/hotels/${hotelId}`);
      const roomsRes = await api.get("/rooms", { params: { hotelId } });

      if (hotelRes.data?.success) setHotel(hotelRes.data.data);
      if (roomsRes.data?.success) setRooms(roomsRes.data.data);
    } catch (err) {
      alert("Error In Fetching Hotel!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  function getNights() {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    const nights = Math.round(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  }

  const nights = getNights();
  const totalPrice = selectedRoom ? nights * selectedRoom.price : 0;

  async function handleBooking(e) {
    e.preventDefault();

    if (!user) {
      alert("Please login to book a room");
      navigate("/login");
      return;
    }
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }
    if (nights <= 0) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/bookings/create", {
        hotelId,
        roomId: selectedRoom._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        totalPrice,
      });

      if (response.data?.success) {
        alert("Booking Confirmed!");
        navigate("/my-bookings");
      } else {
        alert("Booking Failed");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Booking Failed");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!hotel) {
    return <p className="loading-text">Loading hotel...</p>;
  }

  const images = hotel.images?.length ? hotel.images : [null];

  return (
    <main className="hotel-details">
      <div className="details-header">
        <div>
          <h1>{hotel.hotelName}</h1>
          <p className="location">
            <FaMapMarkerAlt /> {hotel.address}, {hotel.city}
          </p>
        </div>
        {hotel.rating > 0 && (
          <div className="rating-pill">
            <FaStar /> {hotel.rating} rating
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="gallery">
        <div className="gallery-main">
          <img
            src={
              images[activeImage]
                ? IMAGE_API + images[activeImage]
                : "https://placehold.co/900x600/123832/f7f5ef?text=BookMyStay"
            }
            alt={hotel.hotelName}
          />
        </div>
        <div className="gallery-thumbs">
          {images.slice(0, 3).map((img, i) => (
            <button
              key={i}
              className={i === activeImage ? "active" : ""}
              onClick={() => setActiveImage(i)}
            >
              <img src={img ? IMAGE_API + img : "https://placehold.co/300x200"} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="details-layout">
        {/* Left */}
        <div className="details-main">
          <section>
            <h2>About this hotel</h2>
            <p className="description">{hotel.description}</p>
          </section>

          {hotel.amenities?.length > 0 && (
            <section>
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {hotel.amenities.map((a) => (
                  <div className="amenity-item" key={a}>
                    <FaCheck /> {a}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2>Choose a room</h2>
            {rooms.length === 0 ? (
              <p className="empty-text">No rooms configured for this hotel yet.</p>
            ) : (
              <div className="room-list">
                {rooms.map((room) => (
                  <button
                    key={room._id}
                    className={
                      "room-card" +
                      (selectedRoom?._id === room._id ? " selected" : "") +
                      (!room.available ? " disabled" : "")
                    }
                    disabled={!room.available}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="room-card-left">
                      <FaBed className="room-icon" />
                      <div>
                        <p className="room-title">
                          {room.roomType} - Room {room.roomNumber}
                        </p>
                        <p className="room-meta">
                          <FaUserFriends /> Up to {room.capacity} guests
                          {!room.available && " - Currently unavailable"}
                        </p>
                      </div>
                    </div>
                    <p className="room-price">₹ {room.price.toLocaleString()} /night</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right */}
        <div className="booking-box">
          <form onSubmit={handleBooking}>
            <h2>Book your stay</h2>

            <div className="date-row">
              <div>
                <label>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>

            <label>Guests</label>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
            />

            <div className="summary">
              <div className="summary-row">
                <span>Selected room</span>
                <span>
                  {selectedRoom ? `${selectedRoom.roomType} - ${selectedRoom.roomNumber}` : "None"}
                </span>
              </div>
              <div className="summary-row">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="confirm-btn" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default HotelDetails;
