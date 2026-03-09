import express from "express";
import { createWorkshopRazorpayOrder, saveWorkshopPayment, fetchWorkshopPayments } from "../controllers/workshopPaymentController.js";

const router = express.Router();

router.post("/create-order", createWorkshopRazorpayOrder);
router.post("/confirm-payment", saveWorkshopPayment);
router.get("/", fetchWorkshopPayments);

export default router;
