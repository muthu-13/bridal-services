import express from "express";
import {
  submitReview,
  fetchApprovedReviews,
  fetchAllReviews,
  approveReviewById,
  deleteReviewById,
} from "../controllers/reviewController.js";

const router = express.Router();

// Customer routes
router.post("/reviews", submitReview);
router.get("/reviews", fetchApprovedReviews);

// Admin routes
router.get("/admin/reviews", fetchAllReviews);
router.put("/admin/reviews/approve/:id", approveReviewById);
router.delete("/admin/reviews/:id", deleteReviewById);

export default router;
