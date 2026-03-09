import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // for redirect
import { UserContext } from "../../context/UserContext";
import "./BookingPage.css";

const initialEventTypesList = ["Marriage", "Reception", "Engagement"];

const servicesList = [
  "Bridal Makeup",
  "Photography",
  "Wedding Dresses",
  "Mehendi",
  "Bridal Hair Styling",
  "Jewellery / Accessories",
  "Bridesmaid & Groom Services",
  "Wedding Decoration",
];

const packages = ["Silver", "Gold", "Platinum"];

const BookingPage = ({ onNext }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize navigate

  const [eventTypesList, setEventTypesList] = useState(initialEventTypesList);
  const [customEventType, setCustomEventType] = useState("");

  const [formData, setFormData] = useState({
    brideName: "",
    eventTypes: [],
    venue: "",
    date: "",
    phone: "",
    services: [],
    package: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.name === "phone") {
      const val = e.target.value.replace(/\D/g, "");
      if (val.length <= 10) {
        setFormData({ ...formData, phone: val });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEventTypeChange = (type) => {
    setFormData((prev) => {
      const selected = prev.eventTypes.includes(type)
        ? prev.eventTypes.filter((t) => t !== type)
        : [...prev.eventTypes, type];
      return { ...prev, eventTypes: selected };
    });
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const selected = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: selected };
    });
  };

  const addCustomEventType = () => {
    const trimmed = customEventType.trim();
    if (
      trimmed &&
      !eventTypesList.includes(trimmed) &&
      !formData.eventTypes.includes(trimmed)
    ) {
      setEventTypesList((prev) => [...prev, trimmed]);
      setFormData((prev) => ({
        ...prev,
        eventTypes: [...prev.eventTypes, trimmed],
      }));
      setCustomEventType("");
      setErrors((prev) => ({ ...prev, eventTypes: null }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.brideName.trim()) {
      errs.brideName = "Bride name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.brideName.trim())) {
      errs.brideName = "Name must contain only letters and spaces";
    }

    if (formData.eventTypes.length === 0) {
      errs.eventTypes = "Select at least one event type";
    }

    if (!formData.venue.trim()) {
      errs.venue = "Venue is required";
    }

    if (!formData.date) {
      errs.date = "Event date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errs.date = "Date cannot be in the past";
      }
    }

    const phone = formData.phone.trim();
    if (!phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errs.phone = "Phone number must be exactly 10 digits";
    }

    if (formData.services.length === 0) {
      errs.services = "Select at least one service";
    }

    if (!formData.package) {
      errs.package = "Choose a package";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login"); // Redirect to login directly if not logged in
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const bookingData = { ...formData, user_id: user.id };

      const res = await fetch("http://localhost:5000/api/dashboard/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      console.log("Booking saved:", data);

      if (data.success && onNext) {
        const bookingDataWithId = { ...bookingData, id: data.id };
        onNext(bookingDataWithId);
      }

      setFormData({
        brideName: "",
        eventTypes: [],
        venue: "",
        date: "",
        phone: "",
        services: [],
        package: "",
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-hero">
        <div className="hero-overlay">
          <h1 className="booking-title">
            Plan Your <span className="gradient-text">Dream Wedding</span>
          </h1>
          <p className="booking-subtitle">
            Let us make your special day unforgettable
          </p>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Booking Details</h2>
            <p className="form-description">
              Fill in the details below to get started with your wedding planning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Bride Name */}
            <div className="form-group">
              <label>Bride Name</label>
              <input
                type="text"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
              />
              {errors.brideName && <p className="error">{errors.brideName}</p>}
            </div>

            {/* Venue */}
            <div className="form-group">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
              />
              {errors.venue && <p className="error">{errors.venue}</p>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <p className="error">{errors.date}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            {/* Event Types */}
            <div className="form-group">
              <label>Event Types</label>
              <div className="card-grid">
                {eventTypesList.map((type) => (
                  <div
                    key={type}
                    className={`select-card ${
                      formData.eventTypes.includes(type) ? "selected" : ""
                    }`}
                    onClick={() => handleEventTypeChange(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>

              <div className="custom-event">
                <input
                  type="text"
                  placeholder="Add custom event"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                />
                <button type="button" onClick={addCustomEventType}>
                  Add
                </button>
              </div>

              {errors.eventTypes && <p className="error">{errors.eventTypes}</p>}
            </div>

            {/* Services */}
            <div className="form-group">
              <label>Services</label>
              <div className="card-grid">
                {servicesList.map((service) => (
                  <div
                    key={service}
                    className={`select-card ${
                      formData.services.includes(service) ? "selected" : ""
                    }`}
                    onClick={() => handleServiceChange(service)}
                  >
                    {service}
                  </div>
                ))}
              </div>
              {errors.services && <p className="error">{errors.services}</p>}
            </div>

            {/* Package */}
            <div className="form-group">
              <label>Packages</label>
              <div className="card-grid">
                {packages.map((pkg) => (
                  <div
                    key={pkg}
                    className={`select-card ${
                      formData.package === pkg ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, package: pkg }))
                    }
                  >
                    {pkg}
                  </div>
                ))}
              </div>
              {errors.package && <p className="error">{errors.package}</p>}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span>Continue to Next Step</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 5L13 10L7 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
