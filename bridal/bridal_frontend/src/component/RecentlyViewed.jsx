import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import "./Services.css";
import "./recentlyViewed.css";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);
  const { user } = useUser(); // get user from context

  // Fetch recently viewed items whenever user changes
  useEffect(() => {
    if (!user) {
      setItems([]); // clear if no user
      return;
    }

    const key = `recentlyViewed_${user.email || user.username || user.id}`;
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Failed to parse recently viewed items:", e);
      setItems([]);
    }
  }, [user]);

  // Helper functions for item fields
  const getDesc = (it) => it?.desc || it?.description || "";
  const getImage = (it) => it?.img || it?.image || it?.thumbnail || "";
  const getLink = (it) => it?.link || it?.url || null;

  if (!items || items.length === 0) {
    return (
      <section className="recently-viewed-wrapper">
        <h2 className="recently-viewed-heading">Recently Viewed</h2>
        <div style={{ color: "#5a4e4e" }}>No recently viewed items yet.</div>
      </section>
    );
  }

  return (
    <section className="recently-viewed-wrapper">
      <h2 className="recently-viewed-heading">Recently Viewed</h2>
      <div className="recently-viewed-list">
        {items.map((it, idx) => {
          const desc = getDesc(it);
          const img = getImage(it);
          const link = getLink(it);

          const card = (
            <div className="service-card">
              {img && (
                <div className="image-container">
                  <img
                    src={img}
                    alt={desc || `item-${idx}`}
                    className="service-img"
                  />
                </div>
              )}
              {desc && <p className="service-desc">{desc}</p>}
            </div>
          );

          return (
            <div className="recently-viewed-item" key={it?.key || idx}>
              {link ? (
                <Link
                  to={link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}