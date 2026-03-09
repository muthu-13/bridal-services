// src/component/utils/FloatingWhatsApp.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import './FloatingWhatsApp.css';

const FloatingWhatsApp = ({ phone = '+919176222005' }) => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  const message = `Hello Bridal Bliss!`;

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="floating-whatsapp" onClick={handleClick}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="whatsapp-logo"
      />
    </div>
  );
};

export default FloatingWhatsApp;
