import db from "../config/db.js"; // mysql connection (db.js la export pannirukanum)

export const getBookingsByUser = (userId, callback) => {
  const sql = "SELECT * FROM bookings WHERE user_id = ?";
  db.query(sql, [userId], callback);
};

export const getPaymentsByUser = (userId, callback) => {
  const sql = `
    SELECT p.* 
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

export const getWishlistByUser = (userId, callback) => {
  const sql = "SELECT * FROM wishlist WHERE user_id = ?";
  db.query(sql, [userId], callback);
};

