import React, { useState } from "react";
import axios from "axios";
import "./feedback.css";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service_type: "",
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/reviews", form);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        service_type: "",
        rating: "",
        comment: "",
      });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ratingOptions = [
    { value: "1", label: "⭐", description: "Poor" },
    { value: "2", label: "⭐⭐", description: "Fair" },
    { value: "3", label: "⭐⭐⭐", description: "Good" },
    { value: "4", label: "⭐⭐⭐⭐", description: "Very Good" },
    { value: "5", label: "⭐⭐⭐⭐⭐", description: "Excellent" }
  ];

  const serviceOptions = [
    { value: "bridal", label: "👰 Bridal Makeup", icon: "👰" },
    { value: "workshop", label: "🎨 Workshop", icon: "🎨" },
    { value: "makeup", label: "💄 Makeup Service", icon: "💄" },
    { value: "mehendi", label: "🌿 Mehendi Art", icon: "🌿" },
    { value: "hairstyling", label: "💇 Hair Styling", icon: "💇" },
    { value: "skincare", label: "✨ Skincare", icon: "✨" }
  ];

  return (
    <div className="feedback-page">
      {/* Success Message */}
      {submitted && (
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h3>Thank You for Your Feedback!</h3>
          <p>Your opinion helps us create better experiences</p>
        </div>
      )}

      <div className="feedback-container">
        {/* Header Section */}
        <div className="feedback-header">
          <h1>Share Your Experience</h1>
          <p>Your feedback lights up our world and helps us shine brighter ✨</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="elegant-form">
          {/* Name & Email Row */}
          <div className="form-row">
            <div className="input-group">
              <label>
                <span className="icon">👤</span>
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter your beautiful name"
                value={form.name}
                onChange={handleChange}
                required
                className="elegant-input"
              />
            </div>

            <div className="input-group">
              <label>
                <span className="icon">📧</span>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="elegant-input"
              />
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="input-group">
            <label>
              <span className="icon">🎯</span>
              Select Service Type
            </label>
            <div className="service-options">
              {serviceOptions.map(service => (
                <div
                  key={service.value}
                  className={`service-option ${form.service_type === service.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, service_type: service.value })}
                >
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-label">{service.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Selection */}
          <div className="input-group">
            <label>
              <span className="icon">⭐</span>
              How was your experience?
            </label>
            <div className="rating-options">
              {ratingOptions.map(rating => (
                <div
                  key={rating.value}
                  className={`rating-option ${form.rating === rating.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, rating: rating.value })}
                >
                  <div className="stars">{rating.label}</div>
                  <div className="rating-description">{rating.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="input-group">
            <label>
              <span className="icon">💬</span>
              Share Your Thoughts
            </label>
            <textarea
              name="comment"
              placeholder="Tell us about your experience... What made you smile? How can we make it even better?"
              value={form.comment}
              onChange={handleChange}
              required
              className="elegant-textarea"
              maxLength="500"
            />
            <div className="character-count">
              {form.comment.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Sending Your Feedback...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Share Your Experience
              </>
            )}
          </button>
        </form>

        {/* Inspiration Quote */}
        <div className="inspiration-quote">
          <p>"Your voice matters - together we create magic! ✨"</p>
        </div>
      </div>
    </div>
  );
}