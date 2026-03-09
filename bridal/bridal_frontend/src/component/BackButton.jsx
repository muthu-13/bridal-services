// src/components/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const styles = {
    backButton: {
      backgroundColor: "#8a8cc1ff",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "20px",
      transition: "background-color 0.3s",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    },
  };

  return (
    <button
      onClick={() => navigate(-1)}
      style={styles.backButton}
      onMouseEnter={(e) => e.target.style.backgroundColor = "#6f72a8"}
      onMouseLeave={(e) => e.target.style.backgroundColor = "#8a8cc1ff"}
    >
      ⬅ Back
    </button>
  );
}
