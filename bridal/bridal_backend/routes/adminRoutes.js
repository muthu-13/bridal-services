import express from "express";
import { fetchDashboardStats } from "../controllers/DashboardController.js";

const router = express.Router();

// GET /api/admin/dashboard-stats
router.get("/dashboard-stats", fetchDashboardStats);

export default router;
