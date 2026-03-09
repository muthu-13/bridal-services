import express from "express";
import {
  fetchStaff,
  createStaff,
  assignStaff,
  fetchBookingStaff,
  setSalary,
} from "../controllers/staffController.js";

const router = express.Router();

// GET all staff
router.get("/", fetchStaff);

// POST add staff
router.post("/", createStaff);

// PUT update salary
router.put("/salary", setSalary);

// POST assign staff to booking
router.post("/assign", assignStaff);

// GET staff assigned for a booking
router.get("/booking/:booking_id", fetchBookingStaff);

export default router;
