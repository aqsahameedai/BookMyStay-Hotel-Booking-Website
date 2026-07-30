import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaSearch } from "react-icons/fa";
import "./Home.css";
import api from "../utils/api";

const IMAGE_API = import.meta.env.VITE_IMAGE_URL;

function Home() {
  const [hotels, setHotels] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  async function getData() {
    try {
      const params = { page };
      if (search) params.search = search;
      if (city) params.city = city;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (sortBy) params.sortBy = sortBy;

      const response = await api.get("/hotels", { params });
      const res = response.data;
      if (res?.success) {
        setHotels(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      alert("Error In Fetching Hotels!!");
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    getData();
  }

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="eyebrow">Est. for the considered traveller</p>
          <h1>
            Find your <em>next stay</em>, not just a room.
          </h1>
          <p className="hero-sub">
            Hand-picked hotels across the country. Transparent pricing, real
            availability, booked in minutes.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search hotels by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
          />
        </div>

        <div className="filter-group">
          <label>Min Rating</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>

        <button className="apply-btn" onClick={handleSearch}>
          Apply Filters
        </button>
      </section>

      {/* Hotel Grid */}
      <section className="hotel-list">
        <h2>{pagination?.total || 0} stays available</h2>

        {hotels.length === 0 ? (
          <p className="empty-text">No hotels match your search.</p>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <Link to={`/hotels/${hotel._id}`} className="hotel-card" key={hotel._id}>
                <div className="hotel-card-img">
                  <img
                    src={
                      hotel.images?.[0]
                        ? IMAGE_API + hotel.images[0]
                        : "https://placehold.co/600x400/123832/f7f5ef?text=BookMyStay"
                    }
                    alt={hotel.hotelName}
                  />
                  {hotel.rating > 0 && (
                    <span className="rating-badge">
                      <FaStar /> {hotel.rating}
                    </span>
                  )}
                </div>
                <div className="hotel-card-body">
                  <h3>{hotel.hotelName}</h3>
                  <p className="hotel-location">
                    <FaMapMarkerAlt /> {hotel.city}
                  </p>
                  <p className="hotel-desc">{hotel.description}</p>
                  <div className="hotel-card-footer">
                    <span className="price">₹ {hotel.pricePerNight?.toLocaleString()}</span>
                    <span className="price-unit">/ night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pagination?.pages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
