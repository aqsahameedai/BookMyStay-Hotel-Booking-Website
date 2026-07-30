import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AdminHotels.css";
import api from "../../utils/api";

const IMAGE_API = import.meta.env.VITE_IMAGE_URL;

function AdminHotels() {
  const [hotelsData, setHotelsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    hotelName: "",
    city: "",
    address: "",
    description: "",
    pricePerNight: "",
    rating: "",
    amenities: "",
    images: [],
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleImageChange(e) {
    setData({ ...data, images: Array.from(e.target.files) });
  }

  async function getHotelsData() {
    try {
      const response = await api.get("/hotels", { params: { limit: 100 } });
      const res = response.data;
      if (res?.success) {
        setHotelsData(res.data);
      }
    } catch (err) {
      alert("Error In Fetching Hotels!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getHotelsData();
  }, []);

  function resetForm() {
    setData({
      hotelName: "",
      city: "",
      address: "",
      description: "",
      pricePerNight: "",
      rating: "",
      amenities: "",
      images: [],
    });
    setEditId(null);
  }

  function openAddForm() {
    resetForm();
    setIsFormOpen(true);
  }

  function openEditForm(hotel) {
    setEditId(hotel._id);
    setData({
      hotelName: hotel.hotelName,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
      pricePerNight: hotel.pricePerNight,
      rating: hotel.rating || "",
      amenities: (hotel.amenities || []).join(", "),
      images: [],
    });
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelName", data.hotelName);
    formData.append("city", data.city);
    formData.append("address", data.address);
    formData.append("description", data.description);
    formData.append("pricePerNight", data.pricePerNight);
    formData.append("rating", data.rating || 0);

    data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => formData.append("amenities", a));

    for (let image of data.images) {
      formData.append("images", image);
    }

    try {
      let response;
      if (editId) {
        formData.append("hotelId", editId);
        response = await api.put("/hotels/update", formData, { headers: undefined });
      } else {
        response = await api.post("/hotels/add", formData, { headers: undefined });
      }

      if (response.data?.success) {
        alert(editId ? "Hotel Updated" : "Hotel Added");
        resetForm();
        setIsFormOpen(false);
        getHotelsData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  }

  async function deleteHotel(hotelId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete("/hotels/delete", { data: { hotelId } });
      if (response.data?.success) {
        alert("Hotel Deleted");
        getHotelsData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete hotel");
      console.log(err);
    }
  }

  return (
    <section className="adminHotels">
      <div className="adminHotelsHeader">
        <h1>Hotels</h1>
        <button className="addBtn" onClick={openAddForm}>
          + Add Hotel
        </button>
      </div>

      <div className="hotelsGrid">
        {hotelsData.map((hotel) => (
          <div className="hotelCard" key={hotel._id}>
            <img
              src={
                hotel.images?.[0]
                  ? IMAGE_API + hotel.images[0]
                  : "https://placehold.co/300x200/123832/f7f5ef?text=BookMyStay"
              }
              alt={hotel.hotelName}
            />
            <div className="hotelCardBody">
              <h3>{hotel.hotelName}</h3>
              <p className="city">{hotel.city}</p>
              <p className="price">₹ {hotel.pricePerNight?.toLocaleString()} /night</p>

              <div className="hotelCardActions">
                <button onClick={() => openEditForm(hotel)}>
                  <FaEdit /> Edit
                </button>
                <button className="deleteBtn" onClick={() => deleteHotel(hotel._id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="formOverlay">
          <div className="formBox">
            <div className="formBoxHeader">
              <h2>{editId ? "Edit Hotel" : "Add Hotel"}</h2>
              <button onClick={() => setIsFormOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Hotel Name</label>
                <input name="hotelName" value={data.hotelName} onChange={handleChange} required />
              </div>

              <div className="formRow">
                <div className="input-group">
                  <label>City</label>
                  <input name="city" value={data.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Price / Night</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={data.pricePerNight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Address</label>
                <input name="address" value={data.address} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="formRow">
                <div className="input-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={data.rating}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                </div>
              </div>

              <div className="input-group">
                <label>Amenities (comma separated)</label>
                <input
                  name="amenities"
                  value={data.amenities}
                  onChange={handleChange}
                  placeholder="Free WiFi, Pool, Parking"
                />
              </div>

              <button className="submit-btn" type="submit">
                {editId ? "Save Changes" : "Add Hotel"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminHotels;
