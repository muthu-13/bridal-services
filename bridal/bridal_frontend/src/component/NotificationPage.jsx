import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationPage = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch user notifications from backend API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/user/${userId}`);
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((ntf) =>
          ntf.id === id ? { ...ntf, is_read: 1 } : ntf
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/notifications/readall/${userId}`);
      setNotifications((prev) => prev.map((ntf) => ({ ...ntf, is_read: 1 })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.is_read;
    if (activeFilter === "read") return notification.is_read;
    return notification.type === activeFilter;
  });

  const unreadCount = notifications.filter(ntf => !ntf.is_read).length;

  const getNotificationIcon = (type) => {
    const icons = {
      info: "💡",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      system: "⚙️",
      booking: "📅",
      payment: "💰",
      reminder: "⏰",
      workshop: "🎨",
      message: "💌"
    };
    return icons[type] || "🔔";
  };

  const getTypeColor = (type) => {
    const colors = {
      info: "#3498db",
      success: "#27ae60",
      warning: "#f39c12",
      error: "#e74c3c",
      system: "#9b59b6",
      booking: "#e91e63",
      payment: "#2ecc71",
      reminder: "#e67e22",
      workshop: "#d81b60",
      message: "#c44569"
    };
    return colors[type] || "#e91e63";
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: '#fce4ec',
      padding: '40px 20px',
      fontFamily: "'Inter', 'Poppins', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      maxWidth: '800px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      padding: '40px',
      boxShadow: '0 25px 60px rgba(199, 21, 133, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    title: {
      color: '#2D3748',
      fontSize: '2.5rem',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(135deg, #e91e63, #d81b60)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    badge: {
      backgroundColor: '#e91e63',
      color: 'white',
      borderRadius: '20px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
    },
    controls: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    markAllButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #e91e63, #d81b60)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'
    },
    filterButtons: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    filterButton: {
      padding: '10px 20px',
      border: '2px solid #F8BBD9',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: '#718096',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeFilter: {
      backgroundColor: '#e91e63',
      color: 'white',
      borderColor: '#e91e63',
      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.25)'
    },
    notificationList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    notificationItem: {
      backgroundColor: '#ffffff',
      border: '2px solid #F7FAFC',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '16px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    unreadNotification: {
      backgroundColor: '#FFF0F6',
      borderColor: '#F8BBD9',
      boxShadow: '0 8px 25px rgba(233, 30, 99, 0.15)'
    },
    notificationHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '12px'
    },
    notificationIcon: {
      fontSize: '22px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #e91e63, #d81b60)'
    },
    notificationContent: {
      flex: 1
    },
    notificationType: {
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px'
    },
    notificationMessage: {
      fontSize: '16px',
      color: '#2D3748',
      lineHeight: '1.5',
      margin: 0,
      fontWeight: '500'
    },
    notificationTime: {
      fontSize: '13px',
      color: '#A0AEC0',
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    unreadDot: {
      width: '10px',
      height: '10px',
      backgroundColor: '#e91e63',
      borderRadius: '50%',
      flexShrink: 0,
      animation: 'pulse 2s infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '80px',
      marginBottom: '24px',
      opacity: 0.7
    },
    emptyTitle: {
      color: '#4A5568',
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    emptyText: {
      color: '#718096',
      fontSize: '16px',
      margin: 0
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#718096'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #e91e63',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    loadingText: {
      fontSize: '16px',
      color: '#718096',
      fontWeight: '500'
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Loading your notifications...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .notification-item {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
      
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.titleSection}>
              <h2 style={styles.title}>Notifications</h2>
              {unreadCount > 0 && (
                <span style={styles.badge}>{unreadCount} New</span>
              )}
            </div>
            
            <div style={styles.controls}>
              {unreadCount > 0 && (
                <button 
                  style={styles.markAllButton}
                  onClick={markAllAsRead}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  ✅ Mark All as Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={styles.filterButtons}>
            {[
              { key: "all", label: "All Notifications" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" },
              { key: "booking", label: "Bookings" },
              { key: "workshop", label: "Workshops" },
              { key: "payment", label: "Payments" }
            ].map(filter => (
              <button
                key={filter.key}
                style={{
                  ...styles.filterButton,
                  ...(activeFilter === filter.key && styles.activeFilter)
                }}
                onClick={() => setActiveFilter(filter.key)}
                onMouseEnter={(e) => !(activeFilter === filter.key) && (e.target.style.borderColor = '#e91e63')}
                onMouseLeave={(e) => !(activeFilter === filter.key) && (e.target.style.borderColor = '#F8BBD9')}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔔</div>
              <h3 style={styles.emptyTitle}>
                {activeFilter === "unread" ? "No Unread Notifications" : 
                 activeFilter === "read" ? "No Read Notifications" :
                 "No Notifications Yet"}
              </h3>
              <p style={styles.emptyText}>
                {activeFilter === "all" ? "You're all caught up! New notifications will appear here." :
                 "No notifications match your current filter."}
              </p>
            </div>
          ) : (
            <ul style={styles.notificationList}>
              {filteredNotifications.map(({ id, message, type, created_at, is_read }) => (
                <li
                  key={id}
                  className="notification-item"
                  onClick={() => !is_read && markAsRead(id)}
                  style={{
                    ...styles.notificationItem,
                    ...(!is_read && styles.unreadNotification)
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={styles.notificationHeader}>
                    <div style={styles.notificationIcon}>
                      {getNotificationIcon(type)}
                    </div>
                    <div style={styles.notificationContent}>
                      <div 
                        style={{
                          ...styles.notificationType,
                          color: getTypeColor(type)
                        }}
                      >
                        {type}
                      </div>
                      <p style={styles.notificationMessage}>{message}</p>
                      <div style={styles.notificationTime}>
                        {!is_read && <div style={styles.unreadDot}></div>}
                        <span>{getTimeAgo(created_at)}</span>
                        <span>•</span>
                        <span>{new Date(created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;