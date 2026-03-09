import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import BackButton from "../BackButton";

export default function PaymentViewPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/api/payments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Payment API response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        setPayments(response.data.data);
      } else if (Array.isArray(response.data)) {
        setPayments(response.data);
      } else {
        setPayments([]);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    
    // Set up auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchPayments, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filter payments based on search and status
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id?.toString().includes(searchTerm) ||
        payment.booking_id?.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = payments.length;
    const successful = payments.filter(p => p.payment_status === "Success" || p.payment_status === "success").length;
    const failed = payments.filter(p => p.payment_status === "Failed" || p.payment_status === "failed").length;
    const pending = payments.filter(p => p.payment_status === "Pending" || p.payment_status === "pending").length;
    const cancelled = payments.filter(p => p.payment_status === "Cancelled" || p.payment_status === "cancelled").length;
    const totalRevenue = payments
      .filter(p => p.payment_status === "Success" || p.payment_status === "success")
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return { total, successful, failed, pending, cancelled, totalRevenue };
  }, [payments]);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto'
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
      color: '#ffffff',
      fontSize: '2.5rem',
      fontWeight: '700',
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      background: 'linear-gradient(135deg, #ffffff, #f0f4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    titleIcon: {
      fontSize: '2.5rem',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
    },
    controlsContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    searchFilterContainer: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '25px'
    },
    searchInput: {
      flex: '1',
      minWidth: '300px',
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
      background: 'linear-gradient(135deg, #ffffff, #f8fafc)'
    },
    filterSelect: {
      padding: '16px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
     
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '160px',
      background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
      fontWeight: '500'
    },
    autoRefreshToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 20px',
      background: autoRefresh ? 
        'linear-gradient(135deg, #48BB78, #38A169)' : 
        'linear-gradient(135deg, #E2E8F0, #CBD5E0)',
      color: autoRefresh ? '#ffffff' : '#4A5568',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    refreshButton: {
      padding: '14px 24px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '10px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#ffffff',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    statCardSuccess: {
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      boxShadow: '0 8px 25px rgba(72, 187, 120, 0.3)'
    },
    statCardWarning: {
      background: 'linear-gradient(135deg, #ED8936, #DD6B20)',
      boxShadow: '0 8px 25px rgba(237, 137, 54, 0.3)'
    },
    statCardDanger: {
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      boxShadow: '0 8px 25px rgba(229, 62, 62, 0.3)'
    },
    statCardRevenue: {
      background: 'linear-gradient(135deg, #9F7AEA, #805AD5)',
      boxShadow: '0 8px 25px rgba(159, 122, 234, 0.3)'
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      opacity: '0.9'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
    },
    tableContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1000px'
    },
    th: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      padding: '18px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      border: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #F1F5F9',
      fontSize: '14px',
      color: '#2D3748',
      fontWeight: '400',
      transition: 'all 0.2s ease'
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textAlign: 'center',
      minWidth: '90px',
      display: 'inline-block',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    statusSuccess: {
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF',
      border: '1px solid #38A169'
    },
    statusFailed: {
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      color: '#FFFFFF',
      border: '1px solid #C53030'
    },
    statusPending: {
      background: 'linear-gradient(135deg, #ED8936, #DD6B20)',
      color: '#FFFFFF',
      border: '1px solid #DD6B20'
    },
    statusCancelled: {
      background: 'linear-gradient(135deg, #A0AEC0, #718096)',
      color: '#FFFFFF',
      border: '1px solid #718096'
    },
    amountPositive: {
      color: '#38A169',
      fontWeight: '700',
      fontSize: '15px',
      background: 'linear-gradient(135deg, #C6F6D5, #9AE6B4)',
      padding: '8px 12px',
      borderRadius: '8px',
      display: 'inline-block',
      boxShadow: '0 2px 4px rgba(72, 187, 120, 0.2)'
    },
    loading: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '18px',
      padding: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontWeight: '500'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096',
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: '0.5'
    },
    lastUpdated: {
      textAlign: 'right',
      fontSize: '13px',
      color: '#A0AEC0',
      marginTop: '20px',
      fontWeight: '500',
      padding: '12px',
      background: 'linear-gradient(135deg, #F7FAFC, #EDF2F7)',
      borderRadius: '8px',
      border: '1px solid #E2E8F0'
    },
    brideNameHighlight: {
      fontWeight: '600',
      color: '#2D3748',
      background: 'linear-gradient(135deg, #FFEB3B, #FFC107)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '15px'
    },
    paymentIdHighlight: {
      fontWeight: '700',
      color: '#667eea',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '14px'
    },
    orderIdStyle: {
      fontFamily: "'Monaco', 'Consolas', monospace",
      fontSize: '12px',
      color: '#4A5568',
      background: 'linear-gradient(135deg, #EDF2F7, #E2E8F0)',
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid #CBD5E0',
      fontWeight: '500'
    },
    rowHover: {
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, #FFFFFF, #F7FAFC)'
    }
  };

  const getStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'success' || statusLower === 'completed') {
      return { ...styles.statusBadge, ...styles.statusSuccess };
    } else if (statusLower === 'failed') {
      return { ...styles.statusBadge, ...styles.statusFailed };
    } else if (statusLower === 'pending') {
      return { ...styles.statusBadge, ...styles.statusPending };
    } else if (statusLower === 'cancelled') {
      return { ...styles.statusBadge, ...styles.statusCancelled };
    }
    return { ...styles.statusBadge, ...styles.statusPending };
  };

  const getStatCardStyle = (index) => {
    switch (index) {
      case 0: return styles.statCard;
      case 1: return { ...styles.statCard, ...styles.statCardSuccess };
      case 2: return { ...styles.statCard, ...styles.statCardWarning };
      case 3: return { ...styles.statCard, ...styles.statCardDanger };
      case 4: return { ...styles.statCard, ...styles.statCardRevenue };
      default: return styles.statCard;
    }
  };

  const statCards = [
    { label: 'Total Payments', value: stats.total, icon: '📊' },
    { label: 'Successful', value: stats.successful, icon: '✅' },
    { label: 'Pending', value: stats.pending, icon: '⏳' },
    { label: 'Failed', value: stats.failed, icon: '❌' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' }
  ];

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loading}>
          <span style={{ fontSize: '24px' }}>💳</span>
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <BackButton />
          <div style={styles.titleSection}>
            <span style={styles.titleIcon}>💳</span>
            <h1 style={styles.title}>Payment Management</h1>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.searchFilterContainer}>
            <input
              type="text"
              placeholder="🔍 Search by bride name, order ID, payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.background = 'linear-gradient(135deg, #ffffff, #f0f4ff)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                e.target.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
              }}
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={styles.autoRefreshToggle}
              onMouseEnter={(e) => {
                if (autoRefresh) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                } else {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(160, 174, 192, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {autoRefresh ? '🟢 Auto Refresh ON' : '⚪ Auto Refresh OFF'}
            </button>

            <button
              onClick={fetchPayments}
              style={styles.refreshButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              <span>🔄</span> Refresh Now
            </button>
          </div>

          {/* Statistics */}
          <div style={styles.statsContainer}>
            {statCards.map((stat, index) => (
              <div 
                key={stat.label}
                style={getStatCardStyle(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
              >
                <div style={styles.statLabel}>
                  <span style={{ marginRight: '8px' }}>{stat.icon}</span>
                  {stat.label}
                </div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💳</div>
            <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
              No payments found
            </div>
            <div style={{ color: '#A0AEC0' }}>
              {searchTerm || statusFilter !== "all" 
                ? 'Try adjusting your search or filters' 
                : 'No payment records available'
              }
            </div>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Payment ID</th>
                  <th style={styles.th}>Bride Name</th>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => {
                  const datetime = formatDateTime(payment.created_at);
                  return (
                    <tr 
                      key={payment.id} 
                      style={{ 
                        background: index % 2 === 0 ? 
                          'linear-gradient(135deg, #FFFFFF, #F7FAFC)' : 
                          'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #E6FFFA, #F0FFF4)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? 
                          'linear-gradient(135deg, #FFFFFF, #F7FAFC)' : 
                          'linear-gradient(135deg, #F8FAFC, #F1F5F9)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <td style={styles.td}>
                        <span style={styles.paymentIdHighlight}>#{payment.id}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.brideNameHighlight}>{payment.brideName}</span>
                      </td>
                      <td style={styles.td}>
                        <strong style={{ color: '#4A5568' }}>{payment.booking_id}</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.amountPositive}>
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={getStatusBadgeStyle(payment.payment_status)}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <code style={styles.orderIdStyle}>
                          {payment.razorpay_order_id}
                        </code>
                      </td>
                      <td style={styles.td}>
                        <span style={{ 
                          fontWeight: '500', 
                          color: '#667eea',
                          background: 'linear-gradient(135deg, #EDF2F7, #E2E8F0)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}>
                          {payment.payment_method || 'Razorpay'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#2D3748' }}>
                          {datetime.date}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          {datetime.time}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div style={styles.lastUpdated}>
              📅 Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
              {autoRefresh && ' • 🔄 Auto-refresh enabled'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}