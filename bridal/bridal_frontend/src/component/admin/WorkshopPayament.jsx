import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";

export default function WorkshopPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/workshop-payments", {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setPayments(response.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on search term and status
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.id?.toString().includes(searchTerm) ||
        payment.workshop_id?.toString().includes(searchTerm) ||
        payment.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount?.toString().includes(searchTerm);

      const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Statistics
  const stats = useMemo(() => {
    const total = payments.length;
    const success = payments.filter(p => p.payment_status === 'success').length;
    const failed = payments.filter(p => p.payment_status === 'failed').length;
    const totalRevenue = payments
      .filter(p => p.payment_status === 'success')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return { total, success, failed, totalRevenue };
  }, [payments]);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
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
      flex: '1'
    },
    title: {
      color: '#2D3748',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#718096',
      fontSize: '1.1rem',
      fontWeight: '400'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '8px'
    },
    statLabel: {
      fontSize: '0.9rem',
      opacity: '0.9',
      fontWeight: '500'
    },
    searchFilter: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '25px',
      marginBottom: '30px',
      border: '1px solid #E2E8F0',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: '1',
      minWidth: '300px',
      padding: '14px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#FFFFFF'
    },
    filterSelect: {
      padding: '14px 20px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#fff',
      cursor: 'pointer',
      minWidth: '150px'
    },
    refreshButton: {
      padding: '14px 24px',
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
      whiteSpace: 'nowrap'
    },
    tableContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
      marginBottom: '30px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      padding: '18px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '14px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #F1F5F9',
      fontSize: '15px',
      color: '#2D3748',
      fontWeight: '400'
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statusSuccess: {
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF'
    },
    statusFailed: {
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      color: '#FFFFFF'
    },
    statusPending: {
      background: 'linear-gradient(135deg, #ED8936, #DD6B20)',
      color: '#FFFFFF'
    },
    amount: {
      fontWeight: '600',
      color: '#2D3748',
      fontSize: '15px'
    },
    paymentId: {
      fontFamily: "'Monaco', 'Consolas', monospace",
      fontSize: '13px',
      color: '#4A5568',
      fontWeight: '500'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginTop: '30px'
    },
    paginationInfo: {
      color: '#718096',
      fontSize: '14px',
      fontWeight: '500'
    },
    paginationControls: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: '10px 16px',
      border: '2px solid #E2E8F0',
      background: '#FFFFFF',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      minWidth: '44px'
    },
    activePage: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      border: '2px solid #667eea'
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#667eea',
      fontSize: '16px',
      fontWeight: '500'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: '0.5'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#718096',
      fontSize: '14px',
      marginBottom: '20px',
      fontWeight: '500',
      padding: '15px',
      background: '#F7FAFC',
      borderRadius: '10px',
      border: '1px solid #E2E8F0'
    },
    dateTime: {
      fontSize: '13px',
      color: '#718096',
      fontWeight: '400'
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'success': return { ...styles.statusBadge, ...styles.statusSuccess };
      case 'failed': return { ...styles.statusBadge, ...styles.statusFailed };
      case 'pending': return { ...styles.statusBadge, ...styles.statusPending };
      default: return { ...styles.statusBadge, ...styles.statusPending };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>Workshop Payments</h2>
            <p style={styles.subtitle}>Monitor and manage all workshop payment transactions</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Payments</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #48BB78, #38A169)'}}>
            <div style={styles.statNumber}>{stats.success}</div>
            <div style={styles.statLabel}>Successful</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #ED8936, #DD6B20)'}}>
            <div style={styles.statNumber}>{stats.failed}</div>
            <div style={styles.statLabel}>Failed</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #9F7AEA, #805AD5)'}}>
            <div style={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div style={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search by Payment ID, Workshop ID, Razorpay ID, or Amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
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
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={fetchPayments}
            style={styles.refreshButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Results Info */}
        <div style={styles.resultsInfo}>
          Showing {currentItems.length} of {filteredPayments.length} payments
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>

        {/* Payments Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Payment Details</th>
                <th style={styles.th}>Workshop</th>
                <th style={styles.th}>Razorpay IDs</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={styles.loadingSpinner}>
                    <div>🔄 Loading payment data...</div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    <div style={styles.emptyIcon}>💳</div>
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>No payments found</div>
                    <div style={{ color: '#A0AEC0' }}>
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'No payment transactions recorded yet'
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((payment, index) => {
                  const datetime = formatDateTime(payment.created_at);
                  return (
                    <tr 
                      key={payment.id}
                      style={{
                        transition: 'all 0.2s ease',
                        background: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F7FAFC';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <td style={styles.td}>
                        <div style={styles.paymentId}>PID-{payment.id}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#2D3748' }}>
                          WID-{payment.workshop_id}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                            Payment ID:
                          </div>
                          <div style={styles.paymentId}>
                            {payment.razorpay_payment_id || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                            Order ID:
                          </div>
                          <div style={styles.paymentId}>
                            {payment.razorpay_order_id || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.amount}>
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={getStatusBadgeStyle(payment.payment_status)}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '500', color: '#2D3748', marginBottom: '4px' }}>
                          {datetime.date}
                        </div>
                        <div style={styles.dateTime}>
                          {datetime.time}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <div style={styles.paginationInfo}>
              Page {currentPage} of {totalPages} • {filteredPayments.length} total payments
            </div>
            <div style={styles.paginationControls}>
              <button
                style={styles.pageButton}
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.color = '#2D3748';
                  }
                }}
              >
                ← Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      style={{
                        ...styles.pageButton,
                        ...(currentPage === pageNumber ? styles.activePage : {}),
                      }}
                      onClick={() => paginate(pageNumber)}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNumber) {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.color = '#667eea';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNumber) {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.color = '#2D3748';
                        }
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} style={{ padding: '10px', color: '#718096' }}>...</span>;
                }
                return null;
              })}
              
              <button
                style={styles.pageButton}
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.color = '#2D3748';
                  }
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}