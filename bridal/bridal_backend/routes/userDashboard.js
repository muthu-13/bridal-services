import { Router } from "express";
import {
  getBookings,
  getPayments,
  getWishlist,
   
} from "../controllers/userDashboardController.js";

const router = Router();

router.get("/bookings/user/:id", getBookings);
router.get("/payments/user/:id", getPayments);
router.get("/wishlist/user/:id", getWishlist);

export default router;
