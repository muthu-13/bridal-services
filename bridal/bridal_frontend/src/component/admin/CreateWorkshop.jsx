import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from "../BackButton";

export default function CreateWorkshop() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    price: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.duration.trim()) newErrors.duration = 'Duration is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.price || form.price < 0) newErrors.price = 'Valid price is required';

    // Date validation
    if (form.date) {
      const today = new Date();
      const selectedDate = new Date(form.date);
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Workshop date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/workshops', {
        ...form,
        price: parseFloat(form.price)
      });
      
      // Show success message
      alert('Workshop created successfully!');
      navigate('/admin/workshops');
    } catch (err) {
      console.error('Workshop creation failed:', err);
      alert('Error creating workshop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
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
      maxWidth: '800px',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '50px',
      boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '40px'
    },
    title: {
      color: '#2D3748',
      fontSize: '36px',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#718096',
      fontSize: '16px',
      marginTop: '8px',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      color: '#2D3748',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    required: {
      color: '#E53E3E'
    },
    input: {
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: '#FFFFFF',
      fontFamily: 'inherit'
    },
    textarea: {
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      minHeight: '140px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      lineHeight: '1.5'
    },
    focused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      backgroundColor: '#FAFBFF'
    },
    error: {
      borderColor: '#E53E3E',
      boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
    },
    errorText: {
      color: '#E53E3E',
      fontSize: '12px',
      fontWeight: '500',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    button: {
      padding: '18px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginTop: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 25px rgba(102, 126, 234, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid #ffffff',
      borderTop: '3px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    imagePreview: {
      marginTop: '8px',
      borderRadius: '8px',
      overflow: 'hidden',
      maxWidth: '200px',
      border: '2px solid #E2E8F0'
    },
    previewImage: {
      width: '100%',
      height: '120px',
      objectFit: 'cover'
    },
    charCount: {
      fontSize: '12px',
      color: '#A0AEC0',
      textAlign: 'right',
      marginTop: '4px'
    }
  };

  // Add CSS animation for spinner
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{spinnerStyle}</style>
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.header}>
            <BackButton />
            <div style={{ flex: 1 }}>
              <h2 style={styles.title}>Create New Workshop</h2>
              <p style={styles.subtitle}>Fill in the details to create an engaging workshop experience</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Workshop Title <span style={styles.required}>*</span>
              </label>
              <input
                name="title"
                placeholder="Enter workshop title..."
                value={form.title}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(errors.title && styles.error)
                }}
                onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                onBlur={(e) => e.target.style = { ...styles.input, ...(errors.title && styles.error) }}
                maxLength={100}
              />
              {errors.title && (
                <span style={styles.errorText}>⚠️ {errors.title}</span>
              )}
              <div style={styles.charCount}>
                {form.title.length}/100 characters
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe what participants will learn..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                style={{
                  ...styles.textarea,
                  ...(errors.description && styles.error)
                }}
                onFocus={(e) => e.target.style = { ...styles.textarea, ...styles.focused }}
                onBlur={(e) => e.target.style = { ...styles.textarea, ...(errors.description && styles.error) }}
                maxLength={500}
              />
              {errors.description && (
                <span style={styles.errorText}>⚠️ {errors.description}</span>
              )}
              <div style={styles.charCount}>
                {form.description.length}/500 characters
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Date <span style={styles.required}>*</span>
                </label>
                <input
                  name="date"
                  type="date"
                  min={getTodayDate()}
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    ...(errors.date && styles.error)
                  }}
                  onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                  onBlur={(e) => e.target.style = { ...styles.input, ...(errors.date && styles.error) }}
                />
                {errors.date && (
                  <span style={styles.errorText}>⚠️ {errors.date}</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Time <span style={styles.required}>*</span>
                </label>
                <input
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    ...(errors.time && styles.error)
                  }}
                  onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                  onBlur={(e) => e.target.style = { ...styles.input, ...(errors.time && styles.error) }}
                />
                {errors.time && (
                  <span style={styles.errorText}>⚠️ {errors.time}</span>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Duration <span style={styles.required}>*</span>
                </label>
                <input
                  name="duration"
                  placeholder="e.g., 2 hours, 1 day"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    ...(errors.duration && styles.error)
                  }}
                  onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                  onBlur={(e) => e.target.style = { ...styles.input, ...(errors.duration && styles.error) }}
                />
                {errors.duration && (
                  <span style={styles.errorText}>⚠️ {errors.duration}</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Price (₹) <span style={styles.required}>*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    ...styles.input,
                    ...(errors.price && styles.error)
                  }}
                  onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                  onBlur={(e) => e.target.style = { ...styles.input, ...(errors.price && styles.error) }}
                />
                {errors.price && (
                  <span style={styles.errorText}>⚠️ {errors.price}</span>
                )}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Location <span style={styles.required}>*</span>
              </label>
              <input
                name="location"
                placeholder="Enter workshop venue or online meeting link"
                value={form.location}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  ...(errors.location && styles.error)
                }}
                onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                onBlur={(e) => e.target.style = { ...styles.input, ...(errors.location && styles.error) }}
              />
              {errors.location && (
                <span style={styles.errorText}>⚠️ {errors.location}</span>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Cover Image URL
              </label>
              <input
                name="image_url"
                placeholder="https://example.com/workshop-image.jpg"
                value={form.image_url}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => e.target.style = { ...styles.input, ...styles.focused }}
                onBlur={(e) => e.target.style = styles.input}
              />
              {form.image_url && (
                <div style={styles.imagePreview}>
                  <img 
                    src={form.image_url} 
                    alt="Preview" 
                    style={styles.previewImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled)
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Creating Workshop...
                </>
              ) : (
                '🎯 Create Workshop'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}