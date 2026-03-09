import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WorkshopPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, workshop } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // ❌ If missing data, redirect back or show message
  if (!formData || !workshop) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Missing payment data. Please register first.</p>
        <button onClick={() => navigate(-1)}>← Back to Registration</button>
      </div>
    );
  }

  // ✅ Fallback if price is undefined
  const amount = workshop.price ?? 1000; // Default ₹1000 if backend doesn't send price

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      // 1️⃣ Create order in backend
      const res = await fetch("http://localhost:5000/api/workshop-payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, workshop_id: workshop.id }),
      });

      const data = await res.json();
      if (!data.success || !data.order) {
        throw new Error("Failed to create order");
      }

      const { order } = data;

      // 2️⃣ Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: "rzp_test_RDyRozfj0uk2Sg", // Use your Razorpay key
          amount: order.amount,
          currency: "INR",
          name: "Bridal Workshop",
          description: `Payment for ${workshop.title}`,
          order_id: order.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#ff6b9d" },
          handler: async function (response) {
            try {
              const verifyRes = await fetch("http://localhost:5000/api/workshop-payments/confirm-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  workshop_id: workshop.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount,
                }),
              });

              const verifyData = await verifyRes.json();
              setPaymentStatus(verifyData.success ? "success" : "error");
            } catch (err) {
              console.error("Payment verification failed:", err);
              setPaymentStatus("error");
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: () => setIsProcessing(false),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      console.error("Payment failed:", err);
      setPaymentStatus("error");
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "60px auto 0 auto" }}>
      <h2>Workshop Payment</h2>
      <p>
        <strong>Workshop:</strong> {workshop.title}
      </p>
      <p>
        <strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Amount:</strong> ₹{amount}
      </p>

      <button onClick={handleRazorpayPayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : `Pay ₹${amount}`}
      </button>

      {paymentStatus === "success" && (
        <p style={{ color: "green", marginTop: "1rem" }}>Payment Successful!</p>
      )}
      {paymentStatus === "error" && (
        <p style={{ color: "red", marginTop: "1rem" }}>Payment Failed. Try again.</p>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        ← Back to Registration
      </button>
    </div>
  );
};

export default WorkshopPaymentPage;
