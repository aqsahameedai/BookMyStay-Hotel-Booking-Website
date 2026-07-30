import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import style from "./AdminLayout.module.css";
import { useUser } from "../context/UserContext";

function AdminLayout() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <section className={style.adminLayout}>
      <div className={style.adminSidebar}>
        <h1>BookMyStay Admin</h1>
        <div className={style.adminLinks}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/hotels">Hotels</Link>
          <Link to="/admin/rooms">Rooms</Link>
          <Link to="/admin/bookings">Bookings</Link>
          <Link to="/admin/users">Users</Link>
        </div>
      </div>
      <Outlet />
    </section>
  );
}

export default AdminLayout;
