import { useEffect, useState } from "react";
import "./AdminUsers.css";
import api from "../../utils/api";

function AdminUsers() {
  const [usersData, setUsersData] = useState([]);

  async function getData() {
    try {
      const response = await api.get("/auth/users");
      const res = response.data;
      if (res?.success) {
        setUsersData(res.data);
      }
    } catch (err) {
      alert("Error In Fetching Users!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="adminUsers">
      <h1>Users</h1>
      <p className="subHeading">Everyone registered on BookMyStay.</p>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contactNumber || "—"}</td>
                <td>
                  <span className={`roleTag ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminUsers;
