import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
 const response = await fetch("http://localhost:5000/api/contact/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
});
 const result = await response.json();
    if (response.ok) {
      setStatus("Your message has been sent successfully! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus(result.message || "Something went wrong. Please try again later.");
    }
  } catch (error) {
    console.error("Submit error:", error);
    setStatus("Network error. Please try again later.");
  }
  setIsSubmitting(false);
  setTimeout(() => setStatus(""), 5000);
};
return (
    <div className="contact-container">
      <div className="contact-bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
      <div className="contact-header">
        <h1 className="contact-title">Get In Touch</h1>
        <p className="contact-subtitle">
          Ready to make your special day unforgettable? Let's create magic together! 
          Contact us for bookings, consultations, or any questions about our bridal services.
        </p>
      </div>
      <div className="contact-content">
        <div className="contact-form-section">
          <div className="form-container">
            <div className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <span className="form-label">Full Name</span>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <span className="form-label">Email Address</span>
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 xxxxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <span className="form-label">Phone Number</span>
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Tell us about your special day, preferred dates, any specific requirements..."
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="form-input form-textarea"
                ></textarea>
                <span className="form-label">Your Message</span>
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="btn-text">Send Message</span>
                    <span className="btn-icon">💌</span>
                  </>
                )}
              </button>

              {status && (
                <div className="success-message">
                  <div className="success-icon">✨</div>
                  <p>{status}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <div className="contact-info">
            <h3 className="info-title">Let's Connect</h3>
            <p className="info-subtitle">
              We're here to make your bridal dreams come true. Reach out through any of these channels:
            </p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <div className="info-content">
                  <h4>Email Us</h4>
                  <p>bridalbliss@gmail.com</p>
                  <small>Response within 4-6 hours</small>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📱</div>
                <div className="info-content">
                  <h4>Call Us</h4>
                  <p>+91 9176222005</p>
                  <small>Mon-Sat: 9 AM - 9 PM</small>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h4>Visit Our Studio</h4>
                  <p>Bridal Bliss<br />Chennai, Tamil Nadu</p>
                  <small>By appointment only</small>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">⏰</div>
                <div className="info-content">
                  <h4>Book Consultation</h4>
                  <p>Free 30-min session</p>
                  <small>Available Mon-Sun</small>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-section">
              <h4>Follow Our Journey</h4>
              <div className="social-links">
                <a href="#" className="social-link">
                  <span>📷</span> Instagram
                </a>
                <a href="#" className="social-link">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="social-link">
                  
                  <span>📌</span> Pinterest
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-section">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Brides</div>
              </div>
              <div className="stat">
                <div className="stat-number">5★</div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .contact-container {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(225, 29, 116, 0.05) 0%, rgba(219, 39, 119, 0.05) 50%, rgba(192, 38, 211, 0.05) 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem 0;
          font-family: 'Poppins', sans-serif;
        }

        /* Animated Background */
        .contact-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: floatShape 20s linear infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #e11d74, #db2777);
          top: 10%;
          left: -5%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #c026d3, #9333ea);
          top: 60%;
          right: -5%;
          animation-delay: -7s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #db2777, #c026d3);
          top: 80%;
          left: 10%;
          animation-delay: -14s;
        }

        @keyframes floatShape {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-30px) rotate(120deg) scale(1.1); 
          }
          66% { 
            transform: translateY(20px) rotate(240deg) scale(0.9); 
          }
        }

        /* Header */
        .contact-header {
          text-align: center;
          padding: 4rem 2rem 2rem;
          position: relative;
          z-index: 2;
        }

        .contact-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          background: linear-gradient(135deg, #e11d74, #db2777, #c026d3);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          position: relative;
          animation: titleSlideIn 1s ease-out;
        }

        .contact-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 5px;
          background: linear-gradient(90deg, #e11d74, #db2777, #c026d3);
          border-radius: 3px;
          animation: expandWidth 1.5s ease-out 0.5s both;
        }

        @keyframes titleSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes expandWidth {
          from { width: 0; }
          to { width: 120px; }
        }

        .contact-subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
          animation: subtitleFadeIn 1s ease-out 0.3s both;
        }

        @keyframes subtitleFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Main Content */
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        /* Form Section */
        .contact-form-section {
          animation: slideInLeft 1s ease-out 0.5s both;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .form-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #e11d74, #db2777, #c026d3, #9333ea);
          background-size: 300% 300%;
          animation: gradientSlide 3s linear infinite;
        }

        @keyframes gradientSlide {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-group {
          position: relative;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 1.2rem 1.5rem;
          border: 2px solid rgba(225, 29, 116, 0.1);
          border-radius: 15px;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #e11d74;
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(225, 29, 116, 0.1);
        }

        .form-label {
          position: absolute;
          top: -8px;
          left: 15px;
          background: white;
          padding: 0 10px;
          font-size: 0.85rem;
          color: #e11d74;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .form-input:focus + .form-label,
        .form-textarea:focus + .form-label,
        .form-select:focus + .form-label {
          opacity: 1;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #e11d74, #db2777, #c026d3);
          background-size: 200% 200%;
          color: white;
          border: none;
          padding: 1.2rem 2rem;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: gradientMove 3s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(225, 29, 116, 0.3);
        }

        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .submit-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(225, 29, 116, 0.4);
        }

        .submit-btn:active {
          transform: translateY(-1px) scale(1.01);
        }

        .submit-btn.submitting {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .btn-icon {
          font-size: 1.2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .success-message {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          margin-top: 1rem;
          animation: successSlideIn 0.5s ease-out;
        }

        @keyframes successSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .success-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: hue-rotate(0deg);
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            filter: hue-rotate(90deg);
          }
        }

        .success-message p {
          color: #22c55e;
          font-weight: 600;
          margin: 0;
        }

        /* Info Section */
        .contact-info-section {
          animation: slideInRight 1s ease-out 0.7s both;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .contact-info {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          height: fit-content;
        }

        .info-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #374151, #1f2937);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .info-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .info-cards {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          border: 1px solid rgba(225, 29, 116, 0.1);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateX(10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border-color: #e11d74;
        }

        .info-icon {
          font-size: 2rem;
          min-width: 50px;
          text-align: center;
          animation: iconPulse 3s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .info-content h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-weight: 700;
        }

        .info-content p {
          margin: 0 0 0.25rem 0;
          color: #4b5563;
          font-weight: 600;
        }

        .info-content small {
          color: #9ca3af;
          font-size: 0.85rem;
        }

        .social-section {
          margin-bottom: 2rem;
        }

        .social-section h4 {
          color: #374151;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #e11d74, #db2777);
          color: white;
          text-decoration: none;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(225, 29, 116, 0.3);
        }

        .stats-section {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .stat {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(225, 29, 116, 0.1), rgba(192, 38, 211, 0.1));
          border-radius: 15px;
          flex: 1;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 900;
          background: linear-gradient(135deg, #e11d74, #c026d3);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1rem;
          }

          .contact-header {
            padding: 2rem 1rem 1rem;
          }

          .form-container,
          .contact-info {
            padding: 2rem 1.5rem;
          }

          .contact-title {
            font-size: 2.5rem;
          }

          .social-links {
            flex-direction: column;
          }

          .stats-section {
            flex-direction: column;
          }

          .floating-shape {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .contact-header {
            padding: 1rem;
          }

          .contact-title {
            font-size: 2rem;
          }

          .form-container,
          .contact-info {
            padding: 1.5rem 1rem;
          }

          .info-card {
            flex-direction: column;
            text-align: center;
          }

          .info-icon {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}