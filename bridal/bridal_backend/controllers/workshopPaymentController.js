import crypto from "crypto";
import Razorpay from "razorpay";
import { addWorkshopPayment, getAllWorkshopPayments } from "../models/workshopPaymentModel.js";

const razorpay = new Razorpay({
  key_id: "rzp_test_RDyRozfj0uk2Sg",
  key_secret: "ZkuQxJ2AOGg1oGvekK8qvgue",
});

// Create Razorpay order
export const createWorkshopRazorpayOrder = async (req, res) => {
  try {
    const { amount, workshop_id } = req.body;
    if (!amount || !workshop_id) {
      return res.status(400).json({ success: false, message: "Amount and Workshop ID required" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `workshop_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verify payment
export const saveWorkshopPayment = async (req, res) => {
  try {
    const { workshop_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;

    if (!workshop_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !amount) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const generated_signature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const result = await addWorkshopPayment({
      workshop_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      payment_status: "success",
    });

    res.json({ success: true, message: "Payment verified", paymentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all payments
export const fetchWorkshopPayments = async (req, res) => {
  try {
    const payments = await getAllWorkshopPayments();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
