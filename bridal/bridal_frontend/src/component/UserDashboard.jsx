import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/dashboard";

  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error("Invalid JSON from", url, "Response:", text);
        return [];
      }
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    Promise.all([
      fetchJson(`${API_URL}/bookings/user/${user.id}`),
      fetchJson(`${API_URL}/wishlist/user/${user.id}`),
      fetchJson(`${API_URL}/payments/user/${user.id}`)
    ])
      .then(([b, w, p]) => {
        setBookings(b);
        setWishlist(w);
        setPayments(p);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/cancel/${bookingId}`, { method: "PUT" });
      const data = await res.json();
      alert(data.message || "Booking cancelled.");

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
      );
      setPayments(prev =>
        prev.map(p =>
          p.booking_id === bookingId ? { ...p, payment_status: "failed" } : p
        )
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Failed to cancel booking.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <p>Please login to view your dashboard.</p>;
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <h2>Welcome, {user.name}</h2>
        <button onClick={() => setTab("profile")}>👤 Profile</button>
        <button onClick={() => setTab("wishlist")}>💄 Wishlist</button>
        <button onClick={() => setTab("bookings")}>📅 Bookings</button>
        <button onClick={() => setTab("payments")}>💳 Payments</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <main className="dashboard-main">
        {tab === "profile" && (
          <section className="dashboard-section">
            <h2>👤 Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </section>
        )}

        {tab === "wishlist" && (
          <section className="dashboard-section">
            <h2>💄 Wishlist</h2>
            {wishlist.length === 0 ? (
              <p>No items in your wishlist.</p>
            ) : (
              <div className="cards-grid">
                {wishlist.map((item) => (
                  <div key={item.id} className="card wishlist-card">
                    {item.url && <img src={item.url} alt={item.desc || "Wishlist"} />}
                    <div className="card-content">
                      <strong>{item.desc || "No description"}</strong>
                      <p>💰 Price: {item.price || "N/A"}</p>
                      <p>⭐ Rating: {item.rating || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "bookings" && (
          <section className="dashboard-section">
            <h2>📅 Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="cards-grid">
                {bookings.map((b) => (
                  <div key={b.id} className={`card ${b.status === "Cancelled" ? "cancelled" : ""}`}>
                    <strong>{b.eventTypes}</strong>
                    <p>Venue: {b.venue}</p>
                    <p>Date: {b.date}</p>
                    <p>Package: {b.package}</p>
                    <p>Status: {b.status}</p>
                    {b.status !== "Cancelled" && (
                      <button onClick={() => cancelBooking(b.id)}>❌ Cancel</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "payments" && (
          <section className="dashboard-section">
            <h2>💳 Payments</h2>
            {payments.length === 0 ? (
              <p>No payments found.</p>
            ) : (
              <div className="cards-grid">
                {payments.map((p) => (
                  <div key={p.id} className="card">
                    <p>Amount: ₹{p.amount}</p>
                    <p>Status: {p.payment_status}</p>
                    <p>Method: {p.payment_method || "N/A"}</p>
                    <p>Date: {new Date(p.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
