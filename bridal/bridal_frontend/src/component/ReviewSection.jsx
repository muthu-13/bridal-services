import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewSection.css";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews"); 
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="review-section">
      <h2>💬 Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to share your experience!</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <h4>
                {r.name} ({r.service_type})
              </h4>

              {/* ⭐ Dynamic star rendering */}
              <div className="stars">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>

              <p className="review-text">"{r.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
