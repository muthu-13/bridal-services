import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Offers.css";

export default function UserOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time for comparison

        const activeOffers = res.data
          .filter((offer) => {
            if (!offer.valid_until) return true;
            const validDate = new Date(offer.valid_until);
            return validDate >= today;
          })
          .map((offer) => {
            if (offer.valid_until) {
              const validDate = new Date(offer.valid_until);
              const timeDiff = validDate - today;
              const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

              let countdown = "";
              if (daysLeft > 1) {
                countdown = `${daysLeft} days left`;
              } else if (daysLeft === 1) {
                countdown = "Offer ends tomorrow!";
              } else if (daysLeft === 0) {
                countdown = "Offer ends today!";
              }

              return { ...offer, countdown };
            }
            return { ...offer, countdown: "" };
          });

        setOffers(activeOffers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="offers-container">
      <h2>Weekly & Special Offers</h2>
      <div className="offer-cards">
        {offers.map((offer) => (
          <div className="offer-card" key={offer.id}>
            {offer.image_url && (
              <img src={offer.image_url} alt={offer.title} />
            )}
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <p className="discount">🎉 {offer.discount}% OFF</p>
            {offer.valid_until && (
              <p className="valid">
                Valid Until: {new Date(offer.valid_until).toLocaleDateString()}
              </p>
            )}
            {offer.countdown && (
              <p className="countdown" style={{ fontWeight: "bold", color: "#cc0000" }}>
                ⏳ {offer.countdown}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
