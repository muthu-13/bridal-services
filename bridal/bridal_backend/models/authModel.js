// models/authModel.js
import db from "../config/db.js";

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  create: (name, email, password, callback) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      callback
    );
  },

  findById: (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], callback);
  },

  // ----------------- OTP -----------------
  setOtp: (email, otp, expiry, callback) => {
    db.query(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
      [otp, expiry, email],
      callback
    );
  },

  findByOtp: (otp, callback) => {
    db.query(
      "SELECT * FROM users WHERE otp = ? AND otp_expiry > NOW()",
      [otp],
      callback
    );
  },

  updatePassword: (id, password, callback) => {
    db.query(
      "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?",
      [password, id],
      callback
    );
  }
};

export default User;
