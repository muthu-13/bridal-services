import React, { useState, useRef } from "react";
import "./VirtualPreviewPage.css";

const VirtualPreviewPage = ({ onNext, onBack }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("lipstick");
  const [appliedEffects, setAppliedEffects] = useState({
    lipstick: null,
    eyeMakeup: null,
    accessories: null,
    hairstyle: null,
    skinTone: null,
    blush: null
  });
  const fileInputRef = useRef(null);

  const categories = {
    lipstick: {
      name: "Lipstick",
      icon: "💋",
      effects: [
        { id: "red", name: "Classic Red", color: "#DC143C", preview: "🔴" },
        { id: "pink", name: "Soft Pink", color: "#FFB6C1", preview: "🌸" },
        { id: "nude", name: "Nude Beige", color: "#DEB887", preview: "🤎" },
        { id: "berry", name: "Berry Wine", color: "#8B008B", preview: "🍇" },
        { id: "coral", name: "Coral Peach", color: "#FF7F50", preview: "🧡" }
      ]
    },
    eyeMakeup: {
      name: "Eye Makeup",
      icon: "👁️",
      effects: [
        { id: "smokey", name: "Smokey Eyes", preview: "🖤", description: "Dark & Dramatic" },
        { id: "natural", name: "Natural Glow", preview: "✨", description: "Subtle & Fresh" },
        { id: "glam", name: "Glamorous", preview: "💫", description: "Bold & Sparkly" },
        { id: "winged", name: "Winged Liner", preview: "🦋", description: "Classic Wing" },
        { id: "colorful", name: "Colorful Pop", preview: "🌈", description: "Vibrant Shades" }
      ]
    },
    accessories: {
      name: "Accessories",
      icon: "💎",
      effects: [
        { id: "earrings", name: "Diamond Earrings", preview: "💍", description: "Elegant Studs" },
        { id: "necklace", name: "Pearl Necklace", preview: "📿", description: "Classic Pearls" },
        { id: "tiara", name: "Bridal Tiara", preview: "👑", description: "Royal Crown" },
        { id: "headband", name: "Floral Headband", preview: "🌸", description: "Flower Crown" },
        { id: "choker", name: "Gold Choker", preview: "🔗", description: "Modern Chain" }
      ]
    },
    hairstyle: {
      name: "Hairstyles",
      icon: "💇‍♀️",
      effects: [
        { id: "updo", name: "Elegant Updo", preview: "🎀", description: "Classic Bun" },
        { id: "curls", name: "Romantic Curls", preview: "🌀", description: "Soft Waves" },
        { id: "braids", name: "Bridal Braids", preview: "🔀", description: "Intricate Braiding" },
        { id: "half", name: "Half Up Half Down", preview: "🎯", description: "Balanced Style" },
        { id: "sleek", name: "Sleek Straight", preview: "📏", description: "Modern Straight" }
      ]
    },
    skinTone: {
      name: "Skin Enhancement",
      icon: "✨",
      effects: [
        { id: "glow", name: "Natural Glow", preview: "🌟", description: "Radiant Finish" },
        { id: "matte", name: "Matte Finish", preview: "🎭", description: "Smooth & Even" },
        { id: "dewy", name: "Dewy Look", preview: "💧", description: "Fresh & Hydrated" },
        { id: "contour", name: "Contoured", preview: "🎨", description: "Defined Features" },
        { id: "highlight", name: "Highlighted", preview: "⭐", description: "Glowing Cheeks" }
      ]
    },
    blush: {
      name: "Blush",
      icon: "🌹",
      effects: [
        { id: "peach", name: "Peach Blush", color: "#FFCBA4", preview: "🍑" },
        { id: "rose", name: "Rose Pink", color: "#F8BBD9", preview: "🌹" },
        { id: "coral", name: "Coral Flush", color: "#FF6B9D", preview: "🪸" },
        { id: "berry", name: "Berry Tint", color: "#C44569", preview: "🫐" },
        { id: "bronze", name: "Bronze Glow", color: "#CD853F", preview: "🥉" }
      ]
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyEffect = (category, effect) => {
    setAppliedEffects(prev => ({
      ...prev,
      [category]: effect
    }));
  };

  const removeEffect = (category) => {
    setAppliedEffects(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleContinue = () => {
    if (onNext) {
      onNext({ image: uploadedImage, effects: appliedEffects });
    }
  };

  return (
    <div className="virtual-preview-container">
      <div className="preview-hero">
        <div className="hero-content">
          <h1 className="preview-title">
            Virtual <span className="gradient-text">Makeover</span>
          </h1>
          <p className="preview-subtitle">See how you'll look on your special day</p>
        </div>
      </div>

      <div className="preview-main">
        <div className="preview-wrapper">
          {/* Image Upload Section */}
          <div className="upload-section">
            <div className="image-container">
              {!uploadedImage ? (
                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <div className="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                  </div>
                  <h3>Upload Your Photo</h3>
                  <p>Click here to upload your image and start your virtual makeover</p>
                  <button className="upload-btn">Choose Photo</button>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={uploadedImage} alt="Uploaded" className="preview-image" />
                  <div className="image-overlay">
                    <button className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Change Photo
                    </button>
                  </div>
                  
                  {/* Applied Effects Overlay */}
                  <div className="effects-overlay">
                    {Object.entries(appliedEffects).map(([category, effect]) => (
                      effect && (
                        <div key={category} className={`effect-layer ${category}-effect`}>
                          <span className="effect-label">{effect.name}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Applied Effects Summary */}
            {uploadedImage && Object.values(appliedEffects).some(effect => effect) && (
              <div className="applied-effects">
                <h4>Applied Effects</h4>
                <div className="effect-tags">
                  {Object.entries(appliedEffects).map(([category, effect]) => (
                    effect && (
                      <div key={category} className="effect-tag">
                        <span>{categories[category].icon} {effect.name}</span>
                        <button onClick={() => removeEffect(category)} className="remove-effect">×</button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Effects Panel */}
          <div className="effects-panel">
            <div className="category-tabs">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="tab-icon">{category.icon}</span>
                  <span className="tab-name">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="effects-grid">
              <h3 className="effects-title">{categories[activeCategory].name}</h3>
              <div className="effects-list">
                {categories[activeCategory].effects.map((effect) => (
                  <div
                    key={effect.id}
                    className={`effect-card ${appliedEffects[activeCategory]?.id === effect.id ? 'selected' : ''}`}
                    onClick={() => applyEffect(activeCategory, effect)}
                  >
                    <div className="effect-preview">
                      {effect.color ? (
                        <div className="color-preview" style={{ backgroundColor: effect.color }}></div>
                      ) : (
                        <span className="effect-emoji">{effect.preview}</span>
                      )}
                    </div>
                    <div className="effect-info">
                      <span className="effect-name">{effect.name}</span>
                      {effect.description && <span className="effect-description">{effect.description}</span>}
                    </div>
                    {appliedEffects[activeCategory]?.id === effect.id && (
                      <div className="selected-indicator">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button className="nav-btn back-btn" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          
          <button 
            className="nav-btn continue-btn" 
            onClick={handleContinue}
            disabled={!uploadedImage}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualPreviewPage;