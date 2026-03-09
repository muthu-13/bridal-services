import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from "../BackButton";

export default function AdminWorkshopsList() {
  const [workshops, setWorkshops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/workshops')
      .then(res => setWorkshops(res.data))
      .catch(err => console.error('Error fetching workshops:', err));
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/workshops/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      try {
        await axios.delete(`http://localhost:5000/api/workshops/${id}`);
        setWorkshops(workshops.filter(w => w.id !== id));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      color: '#ffffff',
      fontSize: '36px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      margin: 0
    },
    createButton: {
      padding: '14px 28px',
      backgroundColor: '#ffffff',
      color: '#667eea',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    tableContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '15px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '3px solid #5568d3'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#333'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    editButton: {
      backgroundColor: '#667eea',
      color: '#fff'
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: '#fff'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
         <BackButton />
        <div style={styles.header}>
          <h2 style={styles.title}>All Workshops</h2>
          <button 
            onClick={() => navigate('/admin/workshops/create')}
            style={styles.createButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            + Create New Workshop
          </button>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((workshop, index) => (
                <tr key={workshop.id} style={{backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'}}>
                  <td style={styles.td}>{workshop.title}</td>
                  <td style={styles.td}>{workshop.date}</td>
                  <td style={styles.td}>{workshop.time}</td>
                  <td style={styles.td}>{workshop.location}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button 
                        onClick={() => handleEdit(workshop.id)}
                        style={{...styles.button, ...styles.editButton}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(workshop.id)}
                        style={{...styles.button, ...styles.deleteButton}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}