import db from '../config/db.js';

// Add payment
export const addPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      payment_status
    } = paymentData;

    const query = `
      INSERT INTO payments 
      (booking_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, payment_status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [booking_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, payment_status], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// Get all payments with booking info
export const getAllPayments = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.*, b.brideName, b.eventTypes AS eventType, b.venue, b.date
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.timestamp DESC
    `;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
