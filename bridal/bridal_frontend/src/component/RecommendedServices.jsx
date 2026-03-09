import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

export default function RecommendedServices({ recommendations = [] }) {
  const items = Array.isArray(recommendations) ? recommendations.slice(0, 3) : [];
  if (items.length === 0) return null;

  return (
    <section style={{ margin: "30px 0" }}>
      <h2 className="service-title" style={{ marginTop: 0, marginBottom: 20 }}>Recommended Services</h2>
      <div
        className="recommendations-row"
        style={{ display: "flex", overflowX: "auto", gap: 20, padding: "10px 2px" }}
      >
        {items.map((rec, idx) => (
          <div key={idx} className="recently-viewed-item" style={{ flex: "0 0 240px" }}>
            <Link to={rec.link} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-card">
                <div className="image-container">
                  <img src={rec.img} alt={rec.title} className="service-img" />
                </div>
                <p className="service-desc" style={{ textAlign: "center" }}>{rec.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}