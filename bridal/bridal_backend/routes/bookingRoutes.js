import express from "express";
import { addBooking, fetchBookings, cancelUserBooking } from "../controllers/bookingController.js";

const router = express.Router();

// User booking form
router.post("/", addBooking);

// Admin view bookings
router.get("/", fetchBookings);

// User cancel booking
router.put("/cancel/:id", cancelUserBooking);

export default router;
