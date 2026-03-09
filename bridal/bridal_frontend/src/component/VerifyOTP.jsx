import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || otp.length !== 6) {
      setMessage("Email and OTP required (OTP must be 6 digits)");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-reset-code", {
        email,
        otp,
      });

      setMessage(res.data.message);
      setTimeout(() => navigate(`/reset-password/${res.data.resetToken}`), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  const styles = {
    container: { maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center", fontFamily: "Arial" },
    input: { width: "100%", padding: "10px", margin: "10px 0", borderRadius: "4px", border: "1px solid #ccc" },
    button: { padding: "10px 20px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
    message: { color: "green", marginTop: "10px" }
  };

  return (
    <div style={styles.container}>
      <h2>Enter OTP</h2>
      <p>An OTP was sent to <b>{email}</b></p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Verify OTP</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}
