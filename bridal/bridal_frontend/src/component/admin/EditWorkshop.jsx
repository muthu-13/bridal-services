import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from "../BackButton";

export default function EditWorkshop() {
  const { id } = useParams();
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
  const [imagePreview, setImagePreview] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkshop();
  }, []);

  useEffect(() => {
    if (form.image_url) {
      setImagePreview(form.image_url);
    }
  }, [form.image_url]);

  const fetchWorkshop = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/workshops/${id}`);
      setForm(response.data);
    } catch (err) {
      console.error('Error loading workshop:', err);
      alert('Could not load workshop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/workshops/${id}`, form);
      alert('Workshop updated successfully! 🎉');
      navigate('/admin/workshops');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Error updating workshop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      color: '#2D3748',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#718096',
      fontSize: '1.1rem',
      fontWeight: '400'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px',
      marginBottom: '30px'
    },
    fullWidth: {
      gridColumn: '1 / -1'
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
      marginBottom: '5px'
    },
    input: {
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#FFFFFF',
      fontWeight: '400',
      width: '100%',
      boxSizing: 'border-box'
    },
    textarea: {
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#FFFFFF',
      fontWeight: '400',
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    imageSection: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    imagePreview: {
      width: '100%',
      maxHeight: '300px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '2px dashed #E2E8F0',
      transition: 'all 0.3s ease'
    },
    fileInput: {
      display: 'none'
    },
    fileInputLabel: {
      padding: '14px 24px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      display: 'inline-block',
      width: 'fit-content'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      gridColumn: '1 / -1'
    },
    submitButton: {
      flex: '1',
      padding: '18px 24px',
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    cancelButton: {
      flex: '1',
      padding: '18px 24px',
      background: '#FFFFFF',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      color: '#667eea',
      fontSize: '16px',
      fontWeight: '500'
    },
    required: {
      color: '#E53E3E',
      marginLeft: '4px'
    },
    priceContainer: {
      position: 'relative'
    },
    priceSymbol: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#718096',
      fontWeight: '600',
      zIndex: '1'
    },
    priceInput: {
      paddingLeft: '35px'
    }
  };

  if (loading && !form.title) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.loadingSpinner}>
            <div>🔄 Loading workshop data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Workshop</h2>
          <p style={styles.subtitle}>Update your workshop details and make it even better</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            {/* Title */}
            <div style={styles.fullWidth}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Workshop Title <span style={styles.required}>*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  placeholder="Enter workshop title"
                  onChange={handleChange}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={styles.fullWidth}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Description <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Describe what participants will learn..."
                  onChange={handleChange}
                  required
                  style={styles.textarea}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Date <span style={styles.required}>*</span>
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
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
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            {/* Duration & Location */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Duration <span style={styles.required}>*</span>
              </label>
              <input
                name="duration"
                value={form.duration}
                placeholder="e.g., 2 hours, 1 day"
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Location <span style={styles.required}>*</span>
              </label>
              <input
                name="location"
                value={form.location}
                placeholder="Workshop venue or online"
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Price */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Price (₹) <span style={styles.required}>*</span>
              </label>
              <div style={styles.priceContainer}>
                <span style={styles.priceSymbol}>₹</span>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  placeholder="0"
                  onChange={handleChange}
                  required
                  min="0"
                  style={{...styles.input, ...styles.priceInput}}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Image Section */}
            <div style={styles.imageSection}>
              <label style={styles.label}>Workshop Image</label>
              
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Workshop preview" 
                  style={styles.imagePreview}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={styles.fileInputLabel}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  📷 Upload New Image
                </label>
                
                <input
                  name="image_url"
                  value={form.image_url}
                  placeholder="Or enter image URL"
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/admin/workshops')}
                style={styles.cancelButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F7FAFC'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
              >
                ❌ Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
                  }
                }}
              >
                {loading ? '⏳ Updating...' : '💾 Update Workshop'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}