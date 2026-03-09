import React from "react";

export default function Services() {
  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #fef5f1 0%, #fdf8f6 100%);
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 60px;
          padding: 40px 20px;
        }

        .header h1 {
          font-size: 3em;
          color: #8B4555;
          margin-bottom: 10px;
          font-weight: normal;
          letter-spacing: 2px;
        }

        .header p {
          font-size: 1.1em;
          color: #A0696F;
          font-style: italic;
        }

        .workshops-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .workshop-item {
          display: flex;
          align-items: center;
          margin-bottom: 80px;
          gap: 40px;
        }

        .workshop-item.reverse {
          flex-direction: row-reverse;
        }

        .workshop-photo {
          flex: 0 0 45%;
          overflow: hidden;
          border-radius: 15px;
          box-shadow: 0 15px 50px rgba(139, 69, 85, 0.2);
        }

        .workshop-photo img {
          width: 100%;
          height: 450px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .workshop-photo:hover img {
          transform: scale(1.05);
        }

        .workshop-content {
          flex: 0 0 55%;
          padding: 30px;
        }

        .workshop-content h2 {
          font-size: 2em;
          color: #8B4555;
          margin-bottom: 15px;
          font-weight: normal;
          letter-spacing: 1px;
        }

        .workshop-content p {
          color: #5A5A5A;
          line-height: 1.8;
          font-size: 1.05em;
          margin-bottom: 15px;
        }

        .workshop-content ul {
          list-style: none;
          margin: 20px 0;
        }

        .workshop-content li {
          color: #696969;
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
          line-height: 1.6;
        }

        .workshop-content li:before {
          content: "✦";
          color: #D4A5A5;
          position: absolute;
          left: 0;
          font-size: 0.8em;
        }

        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 35px;
          background: #8B4555;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 0.95em;
          transition: all 0.3s ease;
          border: 2px solid #8B4555;
        }

        .cta-button:hover {
          background: transparent;
          color: #8B4555;
        }

        @media (max-width: 768px) {
          .workshop-item,
          .workshop-item.reverse {
            flex-direction: column;
          }

          .workshop-photo,
          .workshop-content {
            flex: 0 0 100%;
          }

          .header h1 {
            font-size: 2em;
          }

          .workshop-content h2 {
            font-size: 1.5em;
          }
        }
      `}</style>

      <div className="header">
        <h1>Bridal Workshop</h1>
        <p>Celebrate Your Special Day with Professional Services</p>
      </div>

      <div className="workshops-container">
        {/* Bridal Makeup */}
        <div className="workshop-item">
          <div className="workshop-photo">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop"
              alt="Bridal Makeup"
            />
          </div>
          <div className="workshop-content">
            <h2>Bridal Makeup</h2>
            <p>
              Transform your natural beauty with our expert bridal makeup
              artists. We specialize in creating stunning, long-lasting looks
              that capture your essence and enhance your features on your
              special day.
            </p>
            <p>Our makeup services include:</p>
            <ul>
              <li>Professional makeup application with premium products</li>
              <li>Personalized color consultation for your skin tone</li>
              <li>HD and photography-ready makeup techniques</li>
              <li>Makeup trials and adjustments before the wedding</li>
              <li>Touch-up services throughout the day</li>
            </ul>
            <a href="#contact" className="cta-button">
              Book Consultation
            </a>
          </div>
        </div>

        {/* Bridal Photography */}
        <div className="workshop-item reverse">
          <div className="workshop-photo">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=450&fit=crop"
              alt="Bridal Photography"
            />
          </div>
          <div className="workshop-content">
            <h2>Bridal Photography</h2>
            <p>
              Capture every magical moment of your wedding day with our
              professional bridal photography services. We create timeless
              memories that you'll treasure forever with artistic and creative
              composition.
            </p>
            <p>Photography packages include:</p>
            <ul>
              <li>Full-day wedding coverage with multiple photographers</li>
              <li>Candid and posed portrait sessions</li>
              <li>Professional album and digital file delivery</li>
              <li>Pre-wedding shoot sessions</li>
              <li>Same-day video highlights</li>
            </ul>
            <a href="#contact" className="cta-button">
              View Portfolio
            </a>
          </div>
        </div>

        {/* Bridal Hairstyling */}
        <div className="workshop-item">
          <div className="workshop-photo">
            <img
              src="https://images.unsplash.com/photo-1522335617519-bf1d0390c8a5?w=600&h=450&fit=crop"
              alt="Bridal Hairstyling"
            />
          </div>
          <div className="workshop-content">
            <h2>Bridal Hairstyling</h2>
            <p>
              Elegant and beautiful hairstyles that complement your bridal look
              perfectly. Our expert stylists create intricate designs that blend
              tradition with modern trends, ensuring you look absolutely
              stunning.
            </p>
            <p>Hairstyling services feature:</p>
            <ul>
              <li>Customized hairstyle designs for your face shape</li>
              <li>Traditional and contemporary styling options</li>
              <li>Accessory coordination and placement</li>
              <li>Durability and hold throughout the ceremony</li>
              <li>Professional touch-ups and maintenance during events</li>
            </ul>
            <a href="#contact" className="cta-button">
              Style Booking
            </a>
          </div>
        </div>

        {/* Bridal Mehandi */}
        <div className="workshop-item reverse">
          <div className="workshop-photo">
            <img
              src="https://images.unsplash.com/photo-1514097150912-1cafcc20e15d?w=600&h=450&fit=crop"
              alt="Bridal Mehandi"
            />
          </div>
          <div className="workshop-content">
            <h2>Bridal Mehandi</h2>
            <p>
              Celebrate the beauty of traditional mehandi with our skilled and
              experienced mehandi artists. We create intricate, gorgeous designs
              that enhance your bridal elegance and honor cultural traditions.
            </p>
            <p>Mehandi packages include:</p>
            <ul>
              <li>Authentic bridal mehandi designs with perfect execution</li>
              <li>Traditional and modern pattern styles</li>
              <li>Natural henna with long-lasting color</li>
              <li>Group mehandi sessions and event management</li>
              <li>Customized designs matching your bridal theme</li>
            </ul>
            <a href="#contact" className="cta-button">
              Book Your Mehandi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
