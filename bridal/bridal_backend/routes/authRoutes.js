// routes/authRoute.js
import express from "express";
import passport from "../config/passport.js";
import {
  signup,
  loginUser,
  loginAdmin,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  me,
  logout,
} from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // load .env

const router = express.Router();

// User
router.post("/signup", signup);
router.post("/login", loginUser);

// Admin
router.post("/admin/login", loginAdmin);

// Forgot/reset password
router.post("/forgot-password", forgotPassword);
// NEW: verify the 4-digit code; returns a short-lived JWT for resetting password
router.post("/verify-reset-code", verifyResetCode);
// reset password using token returned from verifyResetCode
router.post("/reset-password/:token", resetPassword);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login` }),
  (req, res) => {
    // Generate JWT token for Google user
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "50d" } // default 50 days
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?googleToken=${token}`);
  }
);

// optional
router.get("/me", me);
router.post("/logout", logout);

export default router;
