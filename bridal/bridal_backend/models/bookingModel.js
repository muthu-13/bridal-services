import db from "../config/db.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_RDyRozfj0uk2Sg",
  key_secret: "ZkuQxJ2AOGg1oGvekK8qvgue",
});

// 🔹 Create Booking
export const createBooking = (booking, callback) => {

  // ✅ Ensure services is a single string
  const servicesValue = Array.isArray(booking.services)
    ? booking.services.join(", ")
    : booking.services;

  const query = `
    INSERT INTO bookings 
      (user_id, brideName, eventTypes, venue, date, phone, services, package, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
  `;

  const values = [
    booking.user_id,
    booking.brideName,
    booking.eventTypes,
    booking.venue,
    booking.date,
    booking.phone,
    servicesValue, // ✅ FIXED
    booking.package
  ];

  db.query(query, values, callback);
};

// 🔹 Fetch All Bookings
export const getAllBookings = (callback) => {
  const query = "SELECT * FROM bookings ORDER BY date DESC";
  db.query(query, callback);
};

// 🔹 Cancel Booking
export const cancelBooking = (id, callback) => {
  const query = "UPDATE bookings SET status = 'Cancelled' WHERE id = ?";
  db.query(query, [id], callback);
};

// 🔹 Refund / Cancel Payment
const calculateRefundPercentage = (bookingDate) => {
  const today = new Date();
  const eventDate = new Date(bookingDate);
  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 1;
  if (diffDays <= 3) return 0.75;
  if (diffDays <= 5) return 0.5;
  if (diffDays <= 10) return 0.25;
  return 0;
};

export const cancelPayment = (bookingId, callback) => {
  const bookingQuery = "SELECT * FROM bookings WHERE id = ?";
  db.query(bookingQuery, [bookingId], (err, bookings) => {
    if (err) return callback(err);
    if (bookings.length === 0) return callback("Booking not found");

    const booking = bookings[0];
    const refundPercent = calculateRefundPercentage(booking.date);

    const paymentQuery = "SELECT * FROM payments WHERE booking_id = ? AND payment_status = 'success'";
    db.query(paymentQuery, [bookingId], async (payErr, payments) => {
      if (payErr) return callback(payErr);
      if (payments.length === 0) return callback(null, "No successful payment found");

      const payment = payments[0];
      const refundAmount = Math.round(payment.amount * refundPercent);

      if (refundPercent === 0) {
        const noRefundQuery = "UPDATE payments SET payment_status = 'no_refund' WHERE booking_id = ?";
        db.query(noRefundQuery, [bookingId], (updateErr) => {
          if (updateErr) return callback(updateErr);
          callback(null, "No refund — more than 10 days before event.");
        });
        return;
      }

      try {
        await razorpay.payments.refund(payment.razorpay_payment_id, {
          amount: refundAmount * 100,
        });

        const updatePaymentQuery = `
          UPDATE payments 
          SET payment_status = 'refunded', 
              refund_amount = ?, 
              refund_percentage = ? 
          WHERE booking_id = ?`;
        db.query(updatePaymentQuery, [refundAmount, refundPercent * 100, bookingId], (updateErr) => {
          if (updateErr) return callback(updateErr);
          callback(null, `Refund ₹${refundAmount} (${refundPercent * 100}%) processed.`);
        });
      } catch (e) {
        callback(e);
      }
    });
  });
};
