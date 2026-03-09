import db from "../config/db.js";

// Save a payment record
export const addWorkshopPayment = async (payment) => {
  const {
    workshop_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    payment_status,
    user_id
  } = payment;

  const [result] = await db.promise().query(
    `INSERT INTO workshop_payments 
     (workshop_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, payment_status, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      workshop_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      payment_status,
      user_id
    ]
  );

  return result;
};

// Get workshop payment by workshop ID and user ID
export const getWorkshopPayment = async (workshopId, userId) => {
  const [rows] = await db.promise().query(
    `SELECT * FROM workshop_payments 
     WHERE workshop_id = ? AND user_id = ? AND payment_status = 'success'
     ORDER BY created_at DESC LIMIT 1`,
    [workshopId, userId]
  );
  return rows[0] || null;
};

// Update payment refund status
export const updatePaymentRefund = async (paymentId, refundAmount, refundPercentage, refundStatus) => {
  const [result] = await db.promise().query(
    `UPDATE workshop_payments 
     SET refund_amount = ?, refund_percentage = ?, payment_status = ?
     WHERE id = ?`,
    [refundAmount, refundPercentage, refundStatus, paymentId]
  );
  return result;
};

// Get all workshop payments
export const getAllWorkshopPayments = async () => {
  const [rows] = await db.promise().query(
    "SELECT * FROM workshop_payments ORDER BY created_at DESC"
  );
  return rows;
};