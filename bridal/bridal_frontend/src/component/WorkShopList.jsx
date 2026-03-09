import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // import your context
import './WorkShopList.css';

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // get logged-in user

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workshops');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  const handleRegister = (workshopId) => {
    if (!user) {
      // User not logged in → redirect to login with return path
      navigate('/login', { state: { from: `/register/${workshopId}` } });
    } else {
      // User logged in → navigate to registration page
      navigate(`/register/${workshopId}`);
    }
  };

  const isOver = (date) => {
    const today = new Date();
    const workshopDate = new Date(date);
    return workshopDate < today;
  };

  return (
    <div className="workshop-list">
      <h2>Upcoming Bridal Workshops</h2>

      {workshops.length === 0 ? (
        <p>No workshops available.</p>
      ) : (
        <div className="workshops-grid">
          {workshops.map((workshop) => {
            const over = isOver(workshop.date);

            return (
              <div className="workshop-card" key={workshop.id}>
                {workshop.image_url && (
                  <img
                    src={workshop.image_url}
                    alt={workshop.title}
                    className="workshop-image"
                  />
                )}
                <h3>{workshop.title}</h3>
                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {workshop.time}</p>
                <p><strong>Duration:</strong> {workshop.duration}</p>
                <p><strong>Location:</strong> {workshop.location}</p>
                <p><strong>Price:</strong> ₹{workshop.price}</p>
                <p>{workshop.description}</p>

                {over ? (
                  <p className="over-text">🚫 Workshop Over</p>
                ) : (
                  <button
                    className="register-button"
                    onClick={() => handleRegister(workshop.id)}
                  >
                    Register
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
