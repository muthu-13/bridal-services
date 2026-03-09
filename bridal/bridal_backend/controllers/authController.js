// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/authModel.js";
import db from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // Load .env

// ----------------- Nodemailer setup -----------------
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
  secure: process.env.MAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail app password if 2FA enabled
  },
});

// ----------------- Helper -----------------
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// ----------------- USER SIGNUP -----------------
export const signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err });

      User.create(name, email, hash, (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: "Signup successful!" });
      });
    });
  });
};

// ----------------- USER LOGIN -----------------
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err2, match) => {
      if (err2) return res.status(500).json({ error: err2 });
      if (!match)
        return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: "user", name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "50d" }
      );

      res.json({
        message: "User login successful!",
        token,
        role: "user",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  });
};

// ----------------- ADMIN LOGIN -----------------
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM admins WHERE username = ?", [username], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(400).json({ message: "Invalid username or password" });

    const admin = result[0];
    if (admin.password !== password)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "50d" }
    );

    res.json({
      message: "Admin login successful!",
      token,
      role: "admin",
      admin: { id: admin.id, username: admin.username },
    });
  });
};

// ----------------- FORGOT PASSWORD (SEND OTP) -----------------
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(400).json({ message: "Email not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    User.setOtp(email, otp, expiry, (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your OTP is <b>${otp}</b></p><p>Valid for 10 minutes.</p>`
      };

      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error("Mail send error:", mailErr);
          return res.status(500).json({ message: "Failed to send email", error: mailErr });
        }
        res.json({ message: "OTP sent to email" });
      });
    });
  });
};

// ----------------- VERIFY OTP -----------------
export const verifyResetCode = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(400).json({ message: "Email not found" });

    const user = result[0];

    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date(user.otp_expiry) < new Date()) return res.status(400).json({ message: "OTP expired" });

    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Clear OTP after verification
    User.setOtp(email, null, null, (clearErr) => {
      if (clearErr) console.error("Failed to clear OTP:", clearErr);
      res.json({ message: "OTP verified", resetToken });
    });
  });
};

// ----------------- RESET PASSWORD -----------------
export const resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid or expired token" });

    const userId = decoded.id;
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err });

      db.query(
        "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?",
        [hash, userId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: "Password reset successful" });
        }
      );
    });
  });
};

// ----------------- CHECK LOGGED-IN USER -----------------
export const me = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const { id, role } = decoded;

    if (role === "user") {
      db.query("SELECT id, name, email FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ role: "user", user: result[0] });
      });
    } else if (role === "admin") {
      db.query("SELECT id, username FROM admins WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ role: "admin", admin: result[0] });
      });
    }
  });
};

// ----------------- LOGOUT -----------------
export const logout = (req, res) => {
  req.session?.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};
