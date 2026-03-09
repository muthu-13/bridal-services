import React, { useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";

export default function AdminProvideOffer() {
  const [offer, setOffer] = useState({
    title: "",
    description: "",
    discount: "",
    image_url: "",
    valid_until: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const errs = {};

    if (!offer.title.trim()) errs.title = "Title is required";
    if (!offer.discount) {
      errs.discount = "Discount is required";
    } else if (offer.discount <= 0 || offer.discount > 100) {
      errs.discount = "Discount must be between 1% and 100%";
    }

    if (offer.valid_until) {
      const selectedDate = new Date(offer.valid_until);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errs.valid_until = "Expiry date cannot be in the past";
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/offers", offer);
      alert("🎉 Offer added successfully!");
      setOffer({
        title: "",
        description: "",
        discount: "",
        image_url: "",
        valid_until: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      maxWidth: '650px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '48px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    containerBefore: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    title: {
      color: '#2d3748',
      fontSize: '28px',
      fontWeight: '700',
      margin: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.5px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      color: '#4a5568',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px'
    },
    input: {
      padding: '16px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: '#ffffff',
      fontFamily: 'inherit',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        transform: 'translateY(-1px)'
      }
    },
    textarea: {
      padding: '16px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: '#ffffff',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
        transform: 'translateY(-1px)'
      }
    },
    button: {
      padding: '18px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginTop: '16px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '13px',
      fontWeight: '500',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    successMessage: {
      backgroundColor: '#48bb78',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '20px',
      fontWeight: '500',
      textAlign: 'center'
    },
    characterCount: {
      textAlign: 'right',
      fontSize: '12px',
      color: '#a0aec0',
      marginTop: '4px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.containerBefore}></div>
        
        <div style={styles.header}>
          <BackButton />
          <h2 style={styles.title}>Create New Offer</h2>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Offer Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter offer title..."
              value={offer.title}
              onChange={handleChange}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            {errors.title && (
              <span style={styles.errorText}>⚠️ {errors.title}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your offer..."
              value={offer.description}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            <div style={styles.characterCount}>
              {offer.description.length}/500 characters
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Discount Percentage *</label>
            <input
              type="number"
              name="discount"
              placeholder="Enter discount (1-100%)"
              value={offer.discount}
              onChange={handleChange}
              min="1"
              max="100"
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            {errors.discount && (
              <span style={styles.errorText}>⚠️ {errors.discount}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="url"
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={offer.image_url}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Valid Until</label>
            <input
              type="date"
              name="valid_until"
              value={offer.valid_until}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            {errors.valid_until && (
              <span style={styles.errorText}>⚠️ {errors.valid_until}</span>
            )}
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(isSubmitting && styles.buttonDisabled)
            }}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                Object.assign(e.target.style, styles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Creating Offer...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>✨</span>
                Create Offer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}