import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="signup-container-wrapper">
      {/* Floating petals */}
      <div className="petal" style={{ left: "5%" }}></div>
      <div className="petal" style={{ left: "25%" }}></div>
      <div className="petal" style={{ left: "50%" }}></div>
      <div className="petal" style={{ left: "75%" }}></div>
      <div className="petal" style={{ left: "90%" }}></div>

      <div className="signup-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label>Confirm Password</label>
            <input type="password" name="confirm" placeholder="Re-enter your password" value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
        <p className="extra">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
