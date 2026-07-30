import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Profile.css";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

function Profile() {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      setName(user.name || "");
      setContactNumber(user.contactNumber || "");
    }
  }, [user, loading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.put("/auth/update-profile", { name, contactNumber });
      if (response.data?.success) {
        setUser(response.data.data);
        alert("Profile Updated");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Could not update profile");
      console.log(err);
    }
  }

  if (!user) return null;

  return (
    <section className="profilePage">
      <h1>Your Profile</h1>

      <div className="profileCard">
        <div className="profileHeader">
          <FaUserCircle className="profileAvatar" />
          <div>
            <h3>{user.name}</h3>
            <p className="roleTag">{user.role === "admin" ? "Administrator" : "Guest account"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input value={user.email} disabled />
            <p className="hint">Email can't be changed.</p>
          </div>

          <div className="input-group">
            <label>Contact number</label>
            <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </div>

          <button className="submit-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
