import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useVoiceCommands } from '../../hooks/useVoiceCommand';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const revenueChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
const {
  isListening,
  lastCommand,
  transcript,
  toggleListening,
  browserSupportsSpeechRecognition
} = useVoiceCommands(navigate);
 

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalWorkshops: 0,
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats');
        setStats(res.data || {});
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (stats.monthlyRevenue?.length > 0) {
      drawRevenueChart(stats.monthlyRevenue);
    }
  }, [stats.monthlyRevenue]);

  const drawRevenueChart = (monthlyData = []) => {
    if (!revenueChartRef.current || monthlyData.length === 0) return;

    const ctx = revenueChartRef.current.getContext('2d');

    if (revenueChartInstance.current) revenueChartInstance.current.destroy();

    revenueChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.map(m => m.month),
        datasets: [
          {
            label: 'Revenue (₹)',
            data: monthlyData.map(m => m.total),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102,126,234,0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { color: 'rgba(0,0,0,0.1)' } }
        }
      }
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex'
    },
    sidebar: {
      width: sidebarOpen ? '280px' : '80px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: '5px 0 25px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      transition: 'all 0.3s ease'
    },
    sidebarHeader: {
      padding: '25px 20px',
      borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebarOpen ? 'space-between' : 'center'
    },
    sidebarTitle: {
      color: '#667eea',
      fontSize: '20px',
      fontWeight: '700',
      margin: 0,
      display: sidebarOpen ? 'block' : 'none'
    },
    toggleBtn: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '5px'
    },
    navLinks: {
      flex: 1,
      padding: '20px 0',
      overflowY: 'auto'
    },
    navGroup: {
      marginBottom: '25px'
    },
    navGroupTitle: {
      color: '#888',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      padding: '0 20px 10px 20px',
      margin: 0,
      display: sidebarOpen ? 'block' : 'none'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      color: '#555',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      borderLeft: '3px solid transparent',
      cursor: 'pointer'
    },
    navLinkHover: {
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      color: '#667eea',
      borderLeft: '3px solid #667eea'
    },
    navIcon: {
      fontSize: '18px',
      minWidth: '30px',
      textAlign: 'center'
    },
    navText: {
      fontSize: '14px',
      fontWeight: '500',
      marginLeft: '15px',
      display: sidebarOpen ? 'block' : 'none',
      whiteSpace: 'nowrap'
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: '1px solid rgba(102, 126, 234, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      padding: '0 20px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      color: '#ffffff',
      fontSize: '42px',
      fontWeight: '700',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    headerControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    voiceButton: {
      padding: '12px 20px',
      backgroundColor: isListening ? '#ff4757' : '#ffffff',
      color: isListening ? '#ffffff' : '#667eea',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoutBtn: {
      padding: '12px 28px',
      backgroundColor: '#ffffff',
      color: '#667eea',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    voiceStatus: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: isListening ? 'rgba(255, 71, 87, 0.9)' : 'rgba(46, 213, 115, 0.9)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      fontSize: '14px',
      fontWeight: '600',
      zIndex: 1000,
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    commandDisplay: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: '#333',
      padding: '15px 30px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '500',
      zIndex: 1000,
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      textAlign: 'center',
      minWidth: '300px'
    },
    sectionTitle: {
      color: '#ffffff',
      fontSize: '26px',
      fontWeight: '600',
      marginBottom: '25px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1.5px'
    },
    analyticsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      textAlign: 'center'
    },
    statCardTitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '15px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#667eea',
      margin: 0
    },
    chartCard: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      marginBottom: '40px'
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '20px',
      textAlign: 'center'
    },
    chartCanvas: {
      height: '300px'
    },
    loading: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '20px',
      padding: '100px',
      fontWeight: '500'
    },
    voiceHelp: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
      color: '#ffffff'
    },
    voiceHelpTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px'
    },
    voiceCommand: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '5px 10px',
      borderRadius: '5px',
      margin: '0 5px',
      fontFamily: 'monospace'
    }
  };

  const navigationGroups = [
    {
      title: 'Bookings & Payments',
      items: [
        { icon: '📅', label: 'View Bookings', path: '/admin/bookings' },
        { icon: '💳', label: 'View Payments', path: '/admin/payments' },
        { icon: '📊', label: 'View Report', path: '/admin/report' }
      ]
    },
    {
      title: 'Services & Offers',
      items: [
        { icon: '➕', label: 'Add Service', path: '/admin/add-service' },
        { icon: '📞', label: 'View Contacts', path: '/admin/contacts' },
        { icon: '🎁', label: 'Provide Offers', path: '/admin/offers' }
      ]
    },
    {
      title: 'Workshops',
      items: [
        { icon: '🎓', label: 'Create Workshop', path: '/admin/workshops/create' },
        { icon: '📚', label: 'Manage Workshops', path: '/admin/workshops' },
        { icon: '📝', label: 'Workshop Registrations', path: '/admin/workshops/registrations' },
        { icon: '💰', label: 'Workshop Payments', path: '/admin/workshops/payments' }
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: '👥', label: 'Manage Staff', path: '/admin/staff' },
        { icon: '⭐', label: 'Manage Reviews', path: '/admin/reviews' },
        { icon: '📦', label: 'Manage Inventory', path: '/admin/inventory' }
      ]
    }
  ];

  if (loading) return <div style={styles.pageContainer}><p style={styles.loading}>Loading dashboard...</p></div>;

  return (
    <div style={styles.pageContainer}>
      {/* Voice Status Indicator */}
      {isListening && (
        <div style={styles.voiceStatus}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            backgroundColor: '#fff', 
            borderRadius: '50%',
            animation: 'pulse 1s infinite'
          }}></div>
          Listening... Speak now
        </div>
      )}

      {/* Last Command Display */}
      {lastCommand && (
        <div style={styles.commandDisplay}>
          🎯 {lastCommand}
        </div>
      )}

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          {sidebarOpen && <h2 style={styles.sidebarTitle}>Admin Panel</h2>}
          <button 
            style={styles.toggleBtn}
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <div style={styles.navLinks}>
          {navigationGroups.map((group, index) => (
            <div key={index} style={styles.navGroup}>
              <h3 style={styles.navGroupTitle}>{group.title}</h3>
              {group.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  style={styles.navLink}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.navLinkHover);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, styles.navLink);
                  }}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={styles.navText}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={styles.sidebarFooter}>
          <div 
            style={styles.navLink}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.navLinkHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, styles.navLink);
            }}
          >
            <span style={styles.navIcon}>🚪</span>
            <span style={styles.navText}>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <div style={styles.headerControls}>
            <button 
              style={styles.voiceButton}
              onClick={toggleListening}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isListening ? '🔴 Stop Listening' : '🎤 Start Voice'}
            </button>
            <button 
              style={styles.logoutBtn} 
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <section>
            <h2 style={styles.sectionTitle}>Analytics Overview</h2>
            <div style={styles.analyticsGrid}>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                <h3 style={styles.statCardTitle}>Total Bookings</h3>
                <p style={styles.statValue}>{stats.totalBookings}</p>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                <h3 style={styles.statCardTitle}>Total Revenue</h3>
                <p style={styles.statValue}>₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                <h3 style={styles.statCardTitle}>Total Services</h3>
                <p style={styles.statValue}>{stats.totalServices}</p>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                <h3 style={styles.statCardTitle}>Total Workshops</h3>
                <p style={styles.statValue}>{stats.totalWorkshops}</p>
              </div>
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Monthly Revenue Trend</h3>
              <div style={styles.chartCanvas}>
                <canvas ref={revenueChartRef}></canvas>
              </div>
            </div>
          </section>

          {/* Voice Commands Help Section */}
          <div style={styles.voiceHelp}>
            <h3 style={styles.voiceHelpTitle}>🎤 Voice Commands Available:</h3>
            <p>Try saying: 
              <span style={styles.voiceCommand}>"go to bookings page"</span>
              <span style={styles.voiceCommand}>"navigate to payments"</span>
              <span style={styles.voiceCommand}>"show reports"</span>
              <span style={styles.voiceCommand}>"open workshops"</span>
            </p>
            <p>Click the microphone button to start/stop voice recognition</p>
          </div>
        </div>
      </div>

      {/* Add CSS animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}