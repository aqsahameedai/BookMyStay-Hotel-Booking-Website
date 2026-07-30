import "./Login.css";
import { useState } from "react";
import api from "../utils/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [authMode, setAuthMode] = useState("login");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function changeMode(mode) {
    setAuthMode(mode);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (authMode === "login") {
        const response = await api.post("/auth/login", {
          email: data.email,
          password: data.password,
        });
        if (response.data?.success) {
          alert(response.data?.message);
          setUser(response.data?.data);
          navigate(response.data?.data?.role === "admin" ? "/admin" : "/");
        }
      } else {
        const response = await api.post("/auth/register", data);
        if (response.data?.success) {
          alert("Account created! Please login.");
          setAuthMode("login");
        }
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  }

  return (
    <main className="auth-container">
      <section className="img-section">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop"
          className="img-bg"
          alt="hotel"
        />
        <div className="img-caption">
          <h2>The Standard of Hospitality</h2>
          <p>
            Hand-picked stays, transparent pricing, and a booking experience
            built for the considered traveller.
          </p>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-wrapper">
          <div className="tabs-container">
            <button
              className={authMode === "login" ? "tab-btn active" : "tab-btn"}
              onClick={() => changeMode("login")}
            >
              Login
            </button>
            <button
              className={authMode === "register" ? "tab-btn active" : "tab-btn"}
              onClick={() => changeMode("register")}
            >
              Create Account
            </button>
          </div>

          <div className="form-header">
            <h1>{authMode === "login" ? "Welcome back" : "Join BookMyStay"}</h1>
            <p>
              {authMode === "login"
                ? "Log in to manage and track your bookings."
                : "Create an account to start booking your stays."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === "register" && (
              <>
                <div className="input-group">
                  <label htmlFor="name">Full name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={data.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="contactNumber">Contact number</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="+91 98765 43210"
                    value={data.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                placeholder="At least 6 characters"
                type="password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="submit-btn">
              {authMode === "register" ? "Create Account" : "Log In"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
