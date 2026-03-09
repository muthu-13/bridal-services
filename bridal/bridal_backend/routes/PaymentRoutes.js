import express from 'express';
import { savePayment, fetchPayments, createRazorpayOrder, refundPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Confirm payment
router.post('/confirm-payment', savePayment);

// Get all payments (admin view)
router.get('/', fetchPayments);
router.post('/refund/:booking_id', refundPayment);
export default router;
