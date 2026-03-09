import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ use context
import ReviewSection from "./ReviewSection";
import RecentlyViewed from "./RecentlyViewed";
import MostlyViewedTicker from "./MostlyViewedTicker"; // ✅ added back

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ get logged-in user

  const services = [
    {
      name: "Bridal Makeup",
      img: "https://i.pinimg.com/736x/59/a3/34/59a334624ce6f7715e2d11840e80c868.jpg",
      link: "/services/bridalmakeup",
    },
    {
      name: "Photography",
      img: "https://sahuphotographystudio.wordpress.com/wp-content/uploads/2017/11/new-couple-sees-photos-from-camera-love-scene.jpg?w=1400&h=875&crop=1",
      link: "/services/photography",
    },
    {
      name: "Wedding Dresses",
      img: "https://velacebridal.com/wp-content/uploads/2023/05/miami-bridal-store.0.0.jpg",
      link: "/services/dresses",
    },
    {
      name: "Mehendi",
      img: "https://i.pinimg.com/736x/db/cd/6a/dbcd6a632b10ada57c6b0e86b74a541e.jpg",
      link: "/services/mehendi",
    },
    {
      name: "Bridal Hair Styling",
      img: "https://weddingsecrets.in/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-04-at-13.15.20.jpeg",
      link: "/services/BridalHairStyling",
    },
    {
      name: "Jewellery / Accessories",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1x16k8lGwUj0CD0rGZL3izskCILObPeE4qzax4q5Ri9-A4HCWrEilKxuFsHma8qSjl_Y&usqp=CAU",
      link: "/services/jewellery",
    },
    {
      name: "Bridesmaid & Groom Services",
      img: "https://i.pinimg.com/736x/3d/24/d7/3d24d71cbddd85615efe4b7617b003b1.jpg",
      link: "/services/bridesmaid-groom",
    },
    {
      name: "Wedding Decoration",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKAuzpkvh-mTw7ULBuaty8WKjoKvUxQD9IPg&s",
      link: "/services/decoration",
    },
  ];

  const packages = [
    {
      name: "Silver Package",
      price: "₹20,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDzeArsifeAKsnqaksPXQLkex4n3GjvYsh6Q&s",
      details: [
        "Basic Bridal Makeup",
        "Photography (200 Pics)",
        "Mehendi",
        "Simple Decoration",
      ],
    },
    {
      name: "Gold Package",
      price: "₹50,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxfnp28WyUwkVOhxT-mnILtnocs91malJI-g&s",
      details: [
        "Premium Makeup",
        "Photography + Album",
        "Designer Dress Rental",
        "Jewellery Set",
        "Stage Decoration",
      ],
    },
    {
      name: "Platinum Package",
      price: "₹75,000",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ4dAvBcBIMEYwn3Ebjpe9xvMKL_eQLxwNnA&s",
      details: [
        "Luxury Bridal Makeup",
        "Full Day Photography & Videography",
        "Designer Outfits",
        "Bridal & Groom Styling",
        "Grand Decoration",
        "Complete Accessories",
      ],
    },
  ];

  const workshops = [
    {
      name: "Bridal Makeup Workshop",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQMSpyNCUHFTE_Soli6nrDaaBSl09V6-zug&s",
      description: "Learn professional bridal makeup techniques from experts.",
      link: "/BridalWorkshopBlog.html",
    },
    {
      name: "Photography Workshop",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKfaTuP3uj1SvR4DwBQnbuLfXVz0cvmyJx0w&s",
      description: "Master wedding photography skills with hands-on sessions.",
      link: "/BridalWorkshopBlog.html",
    },
    {
      name: "Hair styling Workshop",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZkf1tzGXvaTCZ94CXL-azjJOx0UaXEJDd_A&s",
      description: "Get insights on hair styling from start to finish.",
      link: "/BridalWorkshopBlog.html",
    },
  ];

  // ✅ Updated Book Now
  const handleBookNow = (pkgName) => {
    if (user) {
      navigate("/booking", { state: { package: pkgName } });
    } else {
      navigate("/login", { state: { from: "/booking", package: pkgName } });
    }
  };

  return (
    <div className="home-container">
      {/* ✅ Added Mostly Viewed ticker back */}
      <MostlyViewedTicker topN={5} showTitles={true} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span className="logo-shine">Bridal Bliss</span>
          </h1>
          <p>Make your wedding unforgettable with our premium services</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          {services.map((service, index) => (
            <div className="card" key={index}>
              <img src={service.img} alt={service.name} />
              <h3>{service.name}</h3>
              <Link to={service.link} className="btn-small">
                View More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages">
        <h2>Our Packages</h2>
        <div className="package-cards">
          {packages.map((pkg, index) => (
            <div className="package-card" key={index}>
              <img src={pkg.img} alt={pkg.name} className="package-img" />
              <h3>{pkg.name}</h3>
              <p className="price">{pkg.price}</p>
              <ul>
                {pkg.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                className="btn-book"
                onClick={() => handleBookNow(pkg.name)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Workshops Section */}
      <section className="workshops">
        <h2>Few Of Our Workshops</h2>
        <div className="workshop-cards">
          {workshops.map((workshop, index) => (
            <div className="workshop-card" key={index}>
              <img src={workshop.img} alt={workshop.name} />
              <h3>{workshop.name}</h3>
              <p>{workshop.description}</p>
              <Link to={workshop.link} className="btn-small">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Professional Services</h3>
            <p>Expert team for makeup, photography, and planning.</p>
          </div>
          <div className="feature-card">
            <h3>Custom Packages</h3>
            <p>Flexible services tailored to your dream wedding.</p>
          </div>
          <div className="feature-card">
            <h3>Customer Support</h3>
            <p>24/7 assistance for all your queries and bookings.</p>
          </div>
        </div>
      </section>

      <RecentlyViewed />
      <ReviewSection />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Bridal Bliss</h3>
            <p>
              Making your special day unforgettable with premium bridal services
              and elegant solutions.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Pinterest">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/packages">Packages</Link>
              </li>
              <li>
                <Link to="/workshops">Workshops</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/services/bridalmakeup">Bridal Makeup</Link>
              </li>
              <li>
                <Link to="/services/photography">Photography</Link>
              </li>
              <li>
                <Link to="/services/dresses">Wedding Dresses</Link>
              </li>
              <li>
                <Link to="/services/mehendi">Mehendi</Link>
              </li>
              <li>
                <Link to="/services/jewellery">Jewellery</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>
                <i className="fas fa-map-marker-alt"></i> 123 Bridal Street,
                Wedding City, BC 12345
              </p>
              <p>
                <i className="fas fa-phone"></i> +1 (555) 123-4567
              </p>
              <p>
                <i className="fas fa-envelope"></i> info@bridalbliss.com
              </p>
              <p>
                <i className="fas fa-clock"></i> Mon-Sat: 9:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Bridal Bliss. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}