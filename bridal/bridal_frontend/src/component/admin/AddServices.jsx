import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../BackButton";

const AddService = () => {
  const [form, setForm] = useState({
    category: "",
    image_url: "",
    description: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Real-time validation
  useEffect(() => {
    validateField('category', form.category);
    validateField('image_url', form.image_url);
    validateField('description', form.description);
    validateField('rating', form.rating);
  }, [form]);

  // Real-time preview update
  useEffect(() => {
    if (form.category || form.description || form.rating || form.image_url) {
      setPreviewData({
        category: form.category || 'Service Category',
        description: form.description || 'Service description will appear here...',
        rating: form.rating || '4.5',
        image_url: form.image_url
      });
    }
  }, [form]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'category':
        if (!value.trim()) {
          newErrors.category = 'Category is required';
        } else if (value.length < 3) {
          newErrors.category = 'Category must be at least 3 characters';
        } else {
          delete newErrors.category;
        }
        break;
        
      case 'image_url':
        if (!value.trim()) {
          newErrors.image_url = 'Image URL is required';
        } else if (!isValidUrl(value)) {
          newErrors.image_url = 'Please enter a valid URL';
        } else {
          delete newErrors.image_url;
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else {
          delete newErrors.description;
        }
        break;
        
      case 'rating':
        if (!value) {
          newErrors.rating = 'Rating is required';
        } else if (value < 1 || value > 5) {
          newErrors.rating = 'Rating must be between 1 and 5';
        } else {
          delete newErrors.rating;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const validateForm = () => {
    const requiredFields = ['category', 'image_url', 'description', 'rating'];
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/services", {
        ...form,
        rating: parseFloat(form.rating)
      });
      
      setTimeout(() => {
        alert("🎉 Service added successfully!");
        setForm({ category: "", image_url: "", description: "", rating: "" });
        setTouched({});
        setPreviewData(null);
      }, 500);
      
    } catch (err) {
      console.error(err);
      alert("❌ Error adding service");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '40px',
      maxWidth: '1200px',
      width: '100%',
      alignItems: 'start'
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    previewContainer: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 25px 80px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      position: 'sticky',
      top: '30px',
      height: 'fit-content'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px'
    },
    title: {
      color: '#2D3748',
      fontSize: '32px',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px',
      marginTop: '4px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      position: 'relative'
    },
    label: {
      color: '#2D3748',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '2px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    required: {
      color: '#E53E3E'
    },
    input: {
      padding: '14px 16px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '14px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      backgroundColor: '#FFFFFF',
      fontFamily: 'inherit',
      width: '100%'
    },
    textarea: {
      padding: '14px 16px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '14px',
      minHeight: '100px',
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
    valid: {
      borderColor: '#48BB78',
      boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)'
    },
    error: {
      borderColor: '#E53E3E',
      boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.1)'
    },
    errorText: {
      color: '#E53E3E',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    successText: {
      color: '#48BB78',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    button: {
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginTop: '10px',
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      background: 'linear-gradient(135deg, #A0AEC0 0%, #718096 100%)'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '18px',
      height: '18px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    },
    imagePreview: {
      marginTop: '8px',
      borderRadius: '12px',
      overflow: 'hidden',
      width: '100%',
      border: '2px solid #E2E8F0',
      position: 'relative'
    },
    previewImage: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      transition: 'all 0.3s ease'
    },
    imagePlaceholder: {
      width: '100%',
      height: '120px',
      backgroundColor: '#F7FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#A0AEC0',
      fontSize: '14px'
    },
    charCount: {
      fontSize: '11px',
      color: '#A0AEC0',
      textAlign: 'right',
      marginTop: '2px'
    },
    charCountWarning: {
      color: '#ED8936'
    },
    charCountError: {
      color: '#E53E3E'
    },
    previewTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2D3748',
      marginBottom: '20px',
      textAlign: 'center'
    },
    previewCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #E2E8F0',
      overflow: 'hidden'
    },
    previewImageContainer: {
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      backgroundColor: '#F7FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#A0AEC0'
    },
    previewContent: {
      padding: '20px'
    },
    previewCategory: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#2D3748',
      marginBottom: '8px'
    },
    previewDescription: {
      fontSize: '14px',
      color: '#718096',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    stars: {
      display: 'flex',
      gap: '2px'
    },
    star: {
      color: '#FFD700',
      fontSize: '16px'
    },
    ratingText: {
      fontSize: '14px',
      color: '#718096',
      fontWeight: '600'
    },
    progressBar: {
      height: '4px',
      backgroundColor: '#E2E8F0',
      borderRadius: '2px',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#48BB78',
      transition: 'width 0.3s ease',
      borderRadius: '2px'
    },
    quickActions: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    quickButton: {
      padding: '8px 12px',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      backgroundColor: 'white',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flex: 1
    }
  };

  const getCharCountStyle = (current, max) => {
    if (current > max * 0.9) return styles.charCountError;
    if (current > max * 0.7) return styles.charCountWarning;
    return styles.charCount;
  };

  const calculateFormProgress = () => {
    const fields = ['category', 'image_url', 'description', 'rating'];
    const filledFields = fields.filter(field => form[field] && !errors[field]).length;
    return (filledFields / fields.length) * 100;
  };

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(numericRating)) {
        stars.push(<span key={i} style={styles.star}>⭐</span>);
      } else if (i === Math.ceil(numericRating) && numericRating % 1 !== 0) {
        stars.push(<span key={i} style={styles.star}>🌟</span>);
      } else {
        stars.push(<span key={i} style={styles.star}>☆</span>);
      }
    }
    return stars;
  };

  const quickFillExample = () => {
    setForm({
      category: "Bridal Makeup & Hairstyling",
      image_url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
      description: "Complete bridal makeup and hairstyling package for your special day. Professional artists with premium products.",
      rating: "4.8"
    });
  };

  const quickFillExample2 = () => {
    setForm({
      category: "Skincare Treatment",
      image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
      description: "Revitalizing facial treatment with natural ingredients for glowing, healthy skin.",
      rating: "4.6"
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          {/* Form Section */}
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <BackButton />
              <div style={{ flex: 1 }}>
                <h2 style={styles.title}>Add New Service</h2>
                <p style={styles.subtitle}>Create beautiful service listings with real-time preview</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${calculateFormProgress()}%`
                }} 
              />
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <button 
                type="button"
                style={styles.quickButton}
                onClick={quickFillExample}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F7FAFC'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                💄 Bridal Example
              </button>
              <button 
                type="button"
                style={styles.quickButton}
                onClick={quickFillExample2}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F7FAFC'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                ✨ Skincare Example
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Service Category <span style={styles.required}>*</span>
                </label>
                <input
                  name="category"
                  placeholder="e.g., Bridal Makeup, Skincare, Hair Styling"
                  value={form.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={{
                    ...styles.input,
                    ...(touched.category && errors.category ? styles.error : {}),
                    ...(touched.category && !errors.category && form.category ? styles.valid : {}),
                  }}
                  maxLength={50}
                />
                <div style={styles.charCount}>
                  <span style={getCharCountStyle(form.category.length, 50)}>
                    {form.category.length}/50
                  </span>
                </div>
                {touched.category && errors.category && (
                  <span style={styles.errorText}>⚠️ {errors.category}</span>
                )}
                {touched.category && !errors.category && form.category && (
                  <span style={styles.successText}>✓ Perfect category name!</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Image URL <span style={styles.required}>*</span>
                </label>
                <input
                  name="image_url"
                  placeholder="https://example.com/service-image.jpg"
                  value={form.image_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={{
                    ...styles.input,
                    ...(touched.image_url && errors.image_url ? styles.error : {}),
                    ...(touched.image_url && !errors.image_url && form.image_url ? styles.valid : {}),
                  }}
                />
                {touched.image_url && errors.image_url && (
                  <span style={styles.errorText}>⚠️ {errors.image_url}</span>
                )}
                {form.image_url && (
                  <div style={styles.imagePreview}>
                    {imageLoading && (
                      <div style={styles.imagePlaceholder}>Loading image...</div>
                    )}
                    {imageError && (
                      <div style={styles.imagePlaceholder}>❌ Failed to load image</div>
                    )}
                    {!imageLoading && !imageError && (
                      <img 
                        src={form.image_url} 
                        alt="Preview" 
                        style={styles.previewImage}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )}
                  </div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Description <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your service in detail..."
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={{
                    ...styles.textarea,
                    ...(touched.description && errors.description ? styles.error : {}),
                    ...(touched.description && !errors.description && form.description ? styles.valid : {}),
                  }}
                  maxLength={200}
                />
                <div style={styles.charCount}>
                  <span style={getCharCountStyle(form.description.length, 200)}>
                    {form.description.length}/200
                  </span>
                </div>
                {touched.description && errors.description && (
                  <span style={styles.errorText}>⚠️ {errors.description}</span>
                )}
                {touched.description && !errors.description && form.description && (
                  <span style={styles.successText}>✓ Engaging description!</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Rating <span style={styles.required}>*</span>
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="4.5"
                  value={form.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={{
                    ...styles.input,
                    ...(touched.rating && errors.rating ? styles.error : {}),
                    ...(touched.rating && !errors.rating && form.rating ? styles.valid : {}),
                  }}
                />
                {touched.rating && errors.rating && (
                  <span style={styles.errorText}>⚠️ {errors.rating}</span>
                )}
                {touched.rating && !errors.rating && form.rating && (
                  <span style={styles.successText}>
                    ⭐ {form.rating}/5 rating
                  </span>
                )}
              </div>

              <button 
                type="submit"
                style={{
                  ...styles.button,
                  ...(!isFormValid && styles.buttonDisabled)
                }}
                onMouseEnter={(e) => isFormValid && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => isFormValid && (e.target.style.transform = 'translateY(0)')}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Adding Service...
                  </>
                ) : (
                  `💫 Add Service ${isFormValid ? '✓' : ''}`
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div style={styles.previewContainer} className="fade-in">
            <h3 style={styles.previewTitle}>Live Preview</h3>
            <div style={styles.previewCard}>
              {previewData ? (
                <>
                  <div style={styles.previewImageContainer}>
                    {previewData.image_url ? (
                      <img 
                        src={previewData.image_url} 
                        alt="Service" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    ) : (
                      <div>🖼️ Service Image</div>
                    )}
                  </div>
                  
                  <div style={styles.previewContent}>
                    <div style={styles.previewCategory}>
                      {previewData.category}
                    </div>
                    <div style={styles.previewDescription}>
                      {previewData.description}
                    </div>
                    <div style={styles.ratingContainer}>
                      <div style={styles.stars}>
                        {renderStars(previewData.rating)}
                      </div>
                      <span style={styles.ratingText}>
                        {previewData.rating}/5
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#A0AEC0', padding: '60px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>✨</div>
                  <div>Start filling the form to see your service preview</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddService;