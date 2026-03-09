const db = require("../config/db");

// Add item to wishlist
exports.addWishlist = (req, res) => {
  const { user_id, url, desc, rating, price } = req.body;

  const query =
    "INSERT INTO wishlist (user_id, url,` desc`, rating, price) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [user_id, url, desc, rating, price], (err, result) => {
    if (err) {
      console.error("❌ Error inserting wishlist item:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ message: "Item added to wishlist", id: result.insertId });
  });
};

// Get wishlist by user
exports.getWishlist = (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT * FROM wishlist WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching wishlist:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Remove item from wishlist
exports.removeWishlist = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM wishlist WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting wishlist item:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Item removed from wishlist" });
  });
};