import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // adjust path if needed

export default function WorkshopRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [workshop, setWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    city: '',
    language: '',
    experience: '',
    interest: '',
    source: '',
    comments: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/workshops/${id}`)
      .then(res => setWorkshop(res.data))
      .catch(err => console.error('Workshop load error:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = "Invalid email";
    if (!formData.phone.trim()) err.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) err.phone = "Phone should be 10 digits";
    if (!formData.city.trim()) err.city = "City is required";
    if (!formData.language) err.language = "Language is required";
    if (!formData.experience) err.experience = "Select your experience level";
    if (!formData.interest) err.interest = "Select your interest type";
    return err;
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  setErrors(errs);

  if (Object.keys(errs).length === 0) {
    try {
      // ✅ Save registration in backend
      await axios.post(`http://localhost:5000/api/workshops/${id}/register`, {
        ...formData,
        userId: user.id
      });

      // ✅ Redirect to payment page with state
      navigate(`/workshop/${id}/payment`, {
        state: { formData, workshop }
      });

    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  }
};


  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red', fontWeight: '600' }}>
          You must be logged in to register for this workshop.
        </p>
        <button onClick={() => navigate('/login')} style={styles.button}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!workshop) return <p>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="https://s3-us-west-2.amazonaws.com/userdata123/www/imagefields/109794/109794040.jpg"
          alt="Bridal Workshop"
          style={styles.image}
        />
        <h2 style={styles.title}>Register for: {workshop.title}</h2>
        <p style={styles.detail}>
          <strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}
        </p>
        <p style={styles.detail}>
          <strong>Location:</strong> {workshop.location}
        </p>
        <p style={styles.description}>{workshop.description}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { label: "Name *", name: "name" },
            { label: "Email *", name: "email", type: "email" },
            { label: "Phone *", name: "phone", type: "tel" },
            { label: "City *", name: "city" }
          ].map(({ label, name, type = "text" }) => (
            <div key={name} style={styles.inputGroup}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                style={styles.input}
              />
              {errors[name] && <p style={styles.error}>{errors[name]}</p>}
            </div>
          ))}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Preferred Language *</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Select --</option>
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
            {errors.language && <p style={styles.error}>{errors.language}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Experience Level *</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Select --</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Professional</option>
            </select>
            {errors.experience && <p style={styles.error}>{errors.experience}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Who are you? *</label>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Select --</option>
              <option value="Bride">Bride</option>
              <option value="Makeup Artist">Makeup Artist</option>
              <option value="Learner">Learner</option>
              <option value="Other">Other</option>
            </select>
            {errors.interest && <p style={styles.error}>{errors.interest}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>How did you hear about us?</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Select --</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Comments / Expectations</label>
            <textarea
              name="comments"
              rows="3"
              value={formData.comments}
              onChange={handleChange}
              style={{ ...styles.input, height: '80px' }}
            />
          </div>

          <button type="submit" style={styles.button}>Continue with next step</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #fff0f6, #fce4ec)',
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '2.5rem',
    maxWidth: '900px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f9c5d1',
  },
  image: {
    width: '100%',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  title: {
    color: '#e11d74',
    fontWeight: '700',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  detail: {
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '0.3rem',
  },
  description: {
    textAlign: 'center',
    color: '#555',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  label: {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#e11d74',
    marginBottom: '0.4rem',
  },
  input: {
    padding: '0.9rem 1rem',
    borderRadius: '12px',
    border: '2px solid #f9c5d1',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.3s',
  },
  error: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '0.2rem',
  },
  button: {
    background: 'linear-gradient(135deg, #e11d74, #c026d3)',
    color: '#fff',
    padding: '0.9rem 2rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: '0.3s',
  }
};
