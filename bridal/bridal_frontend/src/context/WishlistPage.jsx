


import React, { useContext } from "react";
import { WishlistContext } from "./WishlistContext";
import "./wishlist.css"; // ✅ Import the new CSS file

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="empty-text">Your wishlist is empty ✨</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item, index) => (
            <div key={index} className="wishlist-card">
              <img
                src={item.url}
                alt={item.desc || "Wishlist Item"}
                className="wishlist-img"
              />
              <div className="wishlist-info">
                <p className="wishlist-desc">{item.desc}</p>
                <p className="wishlist-price">{item.price}</p>
                <div className="wishlist-rating">
                  <span className="stars">⭐</span> {item.rating}
                </div>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => toggleWishlist(item)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;