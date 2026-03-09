
import db from "../config/db.js";
export const addReview = (review, callback) => {
  const { name, email, service_type, rating, comment } = review;
  db.query(
    "INSERT INTO reviews (name, email, service_type, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [name, email, service_type, rating, comment],
    callback
  );
};

export const getApprovedReviews = (callback) => {
  db.query(
    "SELECT * FROM reviews WHERE approved=1 ORDER BY created_at DESC",
    callback
  );
};

export const getAllReviews = (callback) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", callback);
};

export const approveReview = (id, callback) => {
  db.query("UPDATE reviews SET approved=1 WHERE id=?", [id], callback);
};

export const deleteReview = (id, callback) => {
  db.query("DELETE FROM reviews WHERE id=?", [id], callback);
};
