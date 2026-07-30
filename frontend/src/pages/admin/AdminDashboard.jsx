import { useEffect, useState } from "react";
import { FaHotel, FaUsers, FaCalendarCheck, FaChartLine, FaTimesCircle, FaRupeeSign } from "react-icons/fa";
import "./AdminDashboard.css";
import api from "../../utils/api";

function AdminDashboard() {
  const [stats, setStats] = useState({});

  async function getData() {
    try {
      const response = await api.get("/admin/stats");
      const res = response.data;
      if (res?.success) {
        setStats(res.data);
      }
    } catch (err) {
      alert("Error In Fetching Stats!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const cards = [
    { label: "Total Hotels", value: stats.totalHotels || 0, icon: <FaHotel /> },
    { label: "Registered Users", value: stats.totalUsers || 0, icon: <FaUsers /> },
    { label: "Total Bookings", value: stats.totalBookings || 0, icon: <FaCalendarCheck /> },
    { label: "Active Bookings", value: stats.activeBookings || 0, icon: <FaChartLine /> },
    { label: "Cancelled Bookings", value: stats.cancelledBookings || 0, icon: <FaTimesCircle /> },
  ];

  return (
    <section className="adminDashboard">
      <h1>Dashboard</h1>

      <div className="statsGrid">
        {cards.map((card) => (
          <div className="statCard" key={card.label}>
            <div className="statIcon">{card.icon}</div>
            <div>
              <p className="statValue">{card.value}</p>
              <p className="statLabel">{card.label}</p>
            </div>
          </div>
        ))}

        <div className="statCard revenue">
          <div className="statIcon">
            <FaRupeeSign />
          </div>
          <div>
            <p className="statValue">₹ {(stats.revenue || 0).toLocaleString()}</p>
            <p className="statLabel">Revenue (paid bookings)</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
