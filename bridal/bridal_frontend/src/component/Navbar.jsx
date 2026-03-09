import React, { useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user, role, logout } = useContext(UserContext);

  // Hide Navbar for admin routes
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    // Add Google Translate script only once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);

      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ta,hi,te,ml,kn,ur,gu",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false, // prevents popup
          },
          "google_translate_element"
        );
      };
    }

    // Hide Google Translate top banner if it appears
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Bridal Bliss</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/workshops">Workshop</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>

        {user && role === "user" ? (
          <>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li>
              <Link to="/notifications" title="Notifications">🔔 Notifications</Link>
            </li>
            <li className="profile-item">
              <Link to="/user-dashboard" title="User Dashboard" className="profile-link">
                <span className="profile-emoji">👤</span>
                <span className="profile-text">Profile</span>
              </Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>

      {/* Google Translate Inline Dropdown */}
      <div id="google_translate_element"></div>
    </nav>
  );
}
