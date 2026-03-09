import crypto from 'crypto';
import { addPayment, getAllPayments } from '../models/paymentModel.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_RDyRozfj0uk2Sg',     
  key_secret: 'ZkuQxJ2AOGg1oGvekK8qvgue',
});

export const savePayment = async (req, res) => {
  try {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount
    } = req.body;

    if (!booking_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !amount) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }

    // Save payment as success
    const result = await addPayment({
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      payment_status: 'success'
    });

    res.json({ success: true, message: 'Payment verified and saved successfully', paymentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const fetchPayments = async (req, res) => {
  try {
    const payments = await getAllPayments(); // returns array
    res.json(payments); // ✅ send array directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, booking_id } = req.body;

    if (!amount || !booking_id) return res.status(400).json({ success: false, message: 'Amount and booking ID required' });

    const options = { amount: amount * 100, currency: 'INR', receipt: 'receipt_' + Date.now() };
    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
};
// Refund payment
export const refundPayment = async (req, res) => {
  try {
    const { booking_id } = req.params;

    // Get payment details from DB
    db.query(
      "SELECT razorpay_payment_id FROM payments WHERE booking_id = ?",
      [booking_id],
      async (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ success: false, message: "DB error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ success: false, message: "Payment not found" });
        }

        const paymentId = results[0].razorpay_payment_id;

        try {
          // Call Razorpay refund API
          const refund = await razorpay.payments.refund(paymentId, { amount: null }); // null => full refund

          // Update DB
          db.query("UPDATE payments SET payment_status = 'refunded' WHERE booking_id = ?", [booking_id]);
          db.query("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", [booking_id]);

          res.json({ success: true, message: "Refund successful", refund });
        } catch (error) {
          console.error("Refund Error:", error);
          res.status(500).json({ success: false, message: "Refund failed", error });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};