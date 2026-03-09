import React, { useState } from "react";
import "./PaymentPage.css";

const PaymentPage = ({ bookingData, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const advanceAmount = 500;
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Razorpay Order from backend
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: advanceAmount, booking_id: bookingData.id }),
      });

      if (!res.ok) throw new Error('Failed to create order');

      const { order } = await res.json();

      // 2. Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_RDyRozfj0uk2Sg',
          amount: order.amount,
          currency: 'INR',
          name: 'Bridal Booking Service',
          description: `Advance payment for ${bookingData.eventTypes}`,
          order_id: order.id,
          prefill: {
            name: bookingData.brideName,
            email: bookingData.email || '',
            contact: bookingData.phone
          },
          theme: { color: '#ff6b9d' },
          handler: function (response) {
            // Razorpay returns payment details + signature
            handlePaymentSuccess(response, order.id);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setPaymentStatus('error');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      console.error(err);
      setPaymentStatus('error');
      setIsProcessing(false);
    }
  };

  // 3. Send to backend for verification
  const handlePaymentSuccess = async (response, order_id) => {
    const paymentData = {
      booking_id: bookingData.id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      amount: advanceAmount
    };

    try {
      const res = await fetch('/api/payments/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error('Payment verification failed');
      }

      console.log('Payment saved:', data);
      setPaymentStatus('success');
    } catch (err) {
      console.error(err);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Final JSX UI
  if (paymentStatus === 'success') {
    return (
      <div className="payment-box">
        <h2>✅ Payment Successful!</h2>
        <p>Advance payment of ₹{advanceAmount} has been processed.</p>
        <button className="back-btn" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="payment-box">
      <h2>Advance Payment</h2>
      <p><strong>Bride:</strong> {bookingData.brideName}</p>
      <p><strong>Event:</strong> {bookingData.eventTypes}</p>
      <p><strong>Venue:</strong> {bookingData.venue}</p>
      <p><strong>Date:</strong> {bookingData.date}</p>

      <div className="button-group">
        <button
          className="pay-btn"
          onClick={handleRazorpayPayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${advanceAmount}`}
        </button>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      {paymentStatus === 'error' && (
        <p className="error-message">❌ Payment failed. Please try again.</p>
      )}
    </div>
  );
};

export default PaymentPage;
