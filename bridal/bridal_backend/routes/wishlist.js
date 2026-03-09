import express from "express";
import db from "../config/db.js"; // ESM import

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.send("✅ Wishlist route is working");
});

// GET wishlist by user_id
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM wishlist WHERE user_id = ?", [req.params.userId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).send("Server error");
  }
});

// ADD item to wishlist
router.post("/", async (req, res) => {
  try {
    const { user_id, url, desc, rating, price } = req.body;

    if (!user_id || !url) {
      return res.status(400).json({ error: "user_id and url are required" });
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO wishlist (user_id, url, `desc`, rating, price) VALUES (?, ?, ?, ?, ?)",
        [user_id, url, desc || "", rating || null, price || null]
      );

    res.json({ message: "✅ Item added to wishlist", id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding wishlist item:", err);
    res.status(500).send("Server error");
  }
});

// DELETE item from wishlist by id
router.delete("/:id", async (req, res) => {
  try {
    await db
      .promise()
      .query("DELETE FROM wishlist WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting wishlist item:", err);
    res.status(500).send("Server error");
  }
});

export default router; // ESM export