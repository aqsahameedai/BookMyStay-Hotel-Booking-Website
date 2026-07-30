import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaUserShield, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { useUser } from "../context/UserContext";

function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const isSuccess = await logout();
    if (isSuccess) {
      alert("Logged out successfully");
      navigate("/");
    }
  }

  return (
    <header>
      {/* Left Side */}
      <div className="header-left">
        <Link to="/" className="header-logo">
          BookMyStay
        </Link>

        <nav className={menuOpen ? "nav-open" : ""}>
          <ul>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Hotels
              </Link>
            </li>
            {user && user.role !== "admin" && (
              <li>
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Right Side */}
      <div className="header-right">
        {!user ? (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <>
            {user.role === "admin" ? (
              <button className="admin-btn" onClick={() => navigate("/admin")}>
                <FaUserShield />
                <span>Admin Panel</span>
              </button>
            ) : (
              <div className="profile-box" onClick={() => navigate("/profile")}>
                <FaUserCircle className="profile-icon" />
                <span>{user.name?.split(" ")[0]}</span>
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Header;
