import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AdminRooms.css";
import api from "../../utils/api";

function AdminRooms() {
  const [roomsData, setRoomsData] = useState([]);
  const [hotelsData, setHotelsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState({
    hotelId: "",
    roomNumber: "",
    roomType: "Single",
    capacity: 1,
    price: "",
    available: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  }

  async function getData() {
    try {
      const roomsRes = await api.get("/rooms");
      const hotelsRes = await api.get("/hotels", { params: { limit: 100 } });

      if (roomsRes.data?.success) setRoomsData(roomsRes.data.data);
      if (hotelsRes.data?.success) setHotelsData(hotelsRes.data.data);
    } catch (err) {
      alert("Error In Fetching Rooms!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function resetForm() {
    setData({
      hotelId: hotelsData[0]?._id || "",
      roomNumber: "",
      roomType: "Single",
      capacity: 1,
      price: "",
      available: true,
    });
    setEditId(null);
  }

  function openAddForm() {
    resetForm();
    setIsFormOpen(true);
  }

  function openEditForm(room) {
    setEditId(room._id);
    setData({
      hotelId: room.hotelId?._id || room.hotelId,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      price: room.price,
      available: room.available,
    });
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let response;
      if (editId) {
        response = await api.put("/rooms/update", { ...data, roomId: editId });
      } else {
        response = await api.post("/rooms/add", data);
      }

      if (response.data?.success) {
        alert(editId ? "Room Updated" : "Room Added");
        setIsFormOpen(false);
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  }

  async function deleteRoom(roomId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete("/rooms/delete", { data: { roomId } });
      if (response.data?.success) {
        alert("Room Deleted");
        getData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not delete room");
      console.log(err);
    }
  }

  return (
    <section className="adminRooms">
      <div className="adminRoomsHeader">
        <h1>Rooms</h1>
        <button className="addBtn" onClick={openAddForm} disabled={hotelsData.length === 0}>
          + Add Room
        </button>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Room</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roomsData.map((room) => (
              <tr key={room._id}>
                <td>{room.hotelId?.hotelName || "—"}</td>
                <td>{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>{room.capacity}</td>
                <td>₹ {room.price?.toLocaleString()}</td>
                <td>
                  <span className={`status ${room.available ? "available" : "occupied"}`}>
                    {room.available ? "Available" : "Occupied"}
                  </span>
                </td>
                <td className="actionCell">
                  <button onClick={() => openEditForm(room)}>
                    <FaEdit />
                  </button>
                  <button className="deleteBtn" onClick={() => deleteRoom(room._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="formOverlay">
          <div className="formBox">
            <div className="formBoxHeader">
              <h2>{editId ? "Edit Room" : "Add Room"}</h2>
              <button onClick={() => setIsFormOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Hotel</label>
                <select
                  name="hotelId"
                  value={data.hotelId}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                >
                  {hotelsData.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hotelName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formRow">
                <div className="input-group">
                  <label>Room Number</label>
                  <input name="roomNumber" value={data.roomNumber} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Room Type</label>
                  <select name="roomType" value={data.roomType} onChange={handleChange}>
                    <option>Single</option>
                    <option>Double</option>
                    <option>Deluxe</option>
                    <option>Suite</option>
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="input-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    min="1"
                    name="capacity"
                    value={data.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Price / Night</label>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="checkboxRow">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={data.available}
                  onChange={handleChange}
                />
                <label htmlFor="available">Available for booking</label>
              </div>

              <button className="submit-btn" type="submit">
                {editId ? "Save Changes" : "Add Room"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminRooms;
