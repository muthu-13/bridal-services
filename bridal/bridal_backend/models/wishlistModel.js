const db = require("../config/db");

// Insert new wishlist item
const addWishlist = (userId, url, desc, rating, price, callback) => {
  const query =
    "INSERT INTO wishlist (user_id, url,` desc`, rating, price) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [userId, url,` desc`, rating, price], callback);
};

// Get all wishlist items for a user
const getWishlist = (userId, callback) => {
  const query = "SELECT * FROM wishlist WHERE user_id = ?";
  db.query(query, [userId], callback);
};

// Remove wishlist item by ID
const removeWishlist = (id, callback) => {
  const query = "DELETE FROM wishlist WHERE id = ?";
  db.query(query, [id], callback);
};

module.exports = { addWishlist, getWishlist, removeWishlist };