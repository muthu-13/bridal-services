import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from "../BackButton";
const AdminReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchComprehensiveReport();
  }, []);

  const fetchComprehensiveReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching report with:', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        year: selectedYear
      });

      const response = await axios.get('http://localhost:5000/api/reports/comprehensive', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          year: selectedYear
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Apply client-side filtering as fallback
        const filteredData = filterDataByDateRange(response.data.data);
        setReportData(filteredData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Full error details:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch report. Check server logs.';
      setError(`Error: ${errorMessage}`);
      
      // Set empty data to prevent crashes
      setReportData({
        financialSummary: {
          bookingRevenue: { total_booking_revenue: 0, total_bookings: 0, successful_booking_revenue: 0, failed_booking_revenue: 0, total_refunds: 0 },
          workshopRevenue: { total_workshop_revenue: 0, total_workshop_payments: 0, successful_workshop_revenue: 0, failed_workshop_revenue: 0, total_refunds: 0 },
          staffCost: { total_staff_cost: 0 },
          inventoryValue: { total_inventory_value: 0 },
          totalUsers: { total_users: 0 }
        },
        paymentStats: { bookingStats: [], workshopStats: [] },
        topServices: [],
        refundDetails: { bookingRefunds: { refund_count: 0, total_refund_amount: 0 }, workshopRefunds: { refund_count: 0, total_refund_amount: 0 } },
        bookingData: [],
        workshopData: [],
        monthlyBookingRevenue: [],
        monthlyWorkshopRevenue: []
      });
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // Client-side date filtering as fallback
  const filterDataByDateRange = (data) => {
    if (!dateRange.startDate || !dateRange.endDate || !data) return data;
    
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999); // End of day

    console.log('Filtering data from', start, 'to', end);

    // Filter booking data
    const filteredBookingData = data.bookingData?.filter(booking => {
      if (!booking) return false;
      const bookingDate = new Date(booking.created_at || booking.date || booking.booking_date);
      return bookingDate >= start && bookingDate <= end;
    }) || [];

    // Filter workshop data
    const filteredWorkshopData = data.workshopData?.filter(workshop => {
      if (!workshop) return false;
      const workshopDate = new Date(workshop.date || workshop.created_at || workshop.workshop_date);
      return workshopDate >= start && workshopDate <= end;
    }) || [];

    // Filter monthly revenue data
    const filteredMonthlyBookingRevenue = data.monthlyBookingRevenue?.filter(month => {
      const monthDate = new Date(month.month + '-01'); // Assuming format 'YYYY-MM'
      return monthDate >= start && monthDate <= end;
    }) || [];

    const filteredMonthlyWorkshopRevenue = data.monthlyWorkshopRevenue?.filter(month => {
      const monthDate = new Date(month.month + '-01');
      return monthDate >= start && monthDate <= end;
    }) || [];

    // Recalculate totals based on filtered data
    const filteredBookingRevenue = filteredBookingData.reduce((total, booking) => 
      total + (booking.amount || booking.revenue || 0), 0);
    
    const filteredWorkshopRevenue = filteredWorkshopData.reduce((total, workshop) => 
      total + (workshop.amount || workshop.revenue || 0), 0);

    const filteredTotalBookings = filteredBookingData.length;
    const filteredTotalWorkshops = filteredWorkshopData.length;

    console.log('Filtered results:', {
      bookings: filteredTotalBookings,
      workshops: filteredTotalWorkshops,
      bookingRevenue: filteredBookingRevenue,
      workshopRevenue: filteredWorkshopRevenue
    });

    return {
      ...data,
      bookingData: filteredBookingData,
      workshopData: filteredWorkshopData,
      monthlyBookingRevenue: filteredMonthlyBookingRevenue,
      monthlyWorkshopRevenue: filteredMonthlyWorkshopRevenue,
      financialSummary: {
        ...data.financialSummary,
        bookingRevenue: {
          ...data.financialSummary.bookingRevenue,
          successful_booking_revenue: filteredBookingRevenue,
          total_bookings: filteredTotalBookings
        },
        workshopRevenue: {
          ...data.financialSummary.workshopRevenue,
          successful_workshop_revenue: filteredWorkshopRevenue,
          total_workshop_payments: filteredTotalWorkshops
        }
      }
    };
  };

  const handleFilterApply = async () => {
    setFilterLoading(true);
    await fetchComprehensiveReport();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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
    title: {
      color: '#ffffff',
      fontSize: '32px',
      fontWeight: '700',
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    controlsContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    filtersContainer: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '20px'
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748'
    },
    dateInput: {
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    select: {
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    applyButton: {
      padding: '10px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: 1
    },
    applyButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    statsContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    statCard: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    contentCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e2e8f0'
    },
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    summaryCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    summaryCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    cardIcon: {
      fontSize: '24px',
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#718096',
      margin: 0
    },
    cardAmount: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2d3748',
      margin: '8px 0'
    },
    cardBreakdown: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      marginTop: '12px'
    },
    breakdownItem: {
      fontSize: '13px',
      color: '#718096',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    paymentStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    paymentType: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    },
    paymentTypeTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    paymentStat: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #f1f5f9'
    },
    paymentStatus: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#4a5568',
      textTransform: 'capitalize'
    },
    paymentCount: {
      fontSize: '13px',
      color: '#718096'
    },
    paymentAmount: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#48bb78'
    },
    servicesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    serviceItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },
    serviceItemHover: {
      backgroundColor: '#edf2f7',
      transform: 'translateX(4px)'
    },
    serviceRank: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '700'
    },
    serviceCategory: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748'
    },
    serviceBookings: {
      fontSize: '13px',
      color: '#718096',
      fontWeight: '500'
    },
    serviceRevenue: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#48bb78'
    },
    refundStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    },
    refundType: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    },
    refundStat: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    refundItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0'
    },
    exportSection: {
      textAlign: 'center',
      marginTop: '32px'
    },
    exportButton: {
      padding: '14px 32px',
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    loading: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '18px',
      padding: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    errorContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      maxWidth: '500px',
      margin: '50px auto'
    },
    errorMessage: {
      color: '#e53e3e',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '20px'
    },
    retryButton: {
      padding: '12px 24px',
      backgroundColor: '#667eea',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    noData: {
      textAlign: 'center',
      color: '#a0aec0',
      fontSize: '14px',
      padding: '20px',
      fontStyle: 'italic'
    },
    dateInfo: {
      fontSize: '12px',
      color: '#667eea',
      fontWeight: '600',
      marginTop: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <p style={styles.loading}>
          <span>📊</span> Loading Financial Report...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>{error}</div>
          <button onClick={fetchComprehensiveReport} style={styles.retryButton}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>No data available</div>
        </div>
      </div>
    );
  }

  const {
    financialSummary = {},
    paymentStats = {},
    topServices = [],
    refundDetails = {},
    bookingData = [],
    workshopData = [],
    monthlyBookingRevenue = [],
    monthlyWorkshopRevenue = []
  } = reportData;

  // Safe data access with defaults
  const bookingRevenue = financialSummary.bookingRevenue || {};
  const workshopRevenue = financialSummary.workshopRevenue || {};
  const staffCost = financialSummary.staffCost || {};
  const inventoryValue = financialSummary.inventoryValue || {};
  const totalUsers = financialSummary.totalUsers || {};

  const totalRevenue = 
    (bookingRevenue.successful_booking_revenue || 0) + 
    (workshopRevenue.successful_workshop_revenue || 0);

  const totalRefunds = 
    (bookingRevenue.total_refunds || 0) + 
    (workshopRevenue.total_refunds || 0);

  const netRevenue = totalRevenue - totalRefunds;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        {/* H<eader */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span>📊</span> Financial Reports & Analytics
          </h1>
        </div>

        {/* Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.filtersContainer}>
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>From:</span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>To:</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>Year:</span>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={styles.select}
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleFilterApply} 
              style={{
                ...styles.applyButton,
                ...(filterLoading && styles.applyButtonDisabled)
              }}
              disabled={filterLoading}
              onMouseEnter={(e) => {
                if (!filterLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!filterLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {filterLoading ? '⏳ Applying...' : '🔍 Apply Filter'}
            </button>
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <span>💰</span> Total Revenue: {formatCurrency(totalRevenue)}
            </div>
            <div style={styles.statCard}>
              <span>📈</span> Net Revenue: {formatCurrency(netRevenue)}
            </div>
            <div style={styles.statCard}>
              <span>👥</span> Total Users: {totalUsers.total_users || 0}
            </div>
            <div style={styles.statCard}>
              <span>📅</span> Date Range: {dateRange.startDate} to {dateRange.endDate}
            </div>
          </div>
        </div>

        {/* Rest of the components remain the same */}
        {/* Financial Summary */}
        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>
            <span>💰</span> Financial Overview
          </h2>
          <div style={styles.dateInfo}>
            Showing data from {dateRange.startDate} to {dateRange.endDate}
          </div>
          <div style={styles.summaryCards}>
            {/* Total Revenue Card */}
            <div 
              style={styles.summaryCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCardHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCard);
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{...styles.cardIcon, backgroundColor: 'rgba(102, 126, 234, 0.1)', color: '#667eea'}}>
                  💰
                </div>
                <h3 style={styles.cardTitle}>Total Revenue</h3>
              </div>
              <div style={styles.cardAmount}>{formatCurrency(totalRevenue)}</div>
              <div style={styles.cardBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Bookings:</span>
                  <span style={{color: '#48bb78', fontWeight: '600'}}>
                    {formatCurrency(bookingRevenue.successful_booking_revenue)}
                  </span>
                </div>
                <div style={styles.breakdownItem}>
                  <span>Workshops:</span>
                  <span style={{color: '#48bb78', fontWeight: '600'}}>
                    {formatCurrency(workshopRevenue.successful_workshop_revenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Revenue Card */}
            <div 
              style={styles.summaryCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCardHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCard);
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{...styles.cardIcon, backgroundColor: 'rgba(72, 187, 120, 0.1)', color: '#48bb78'}}>
                  📈
                </div>
                <h3 style={styles.cardTitle}>Net Revenue</h3>
              </div>
              <div style={styles.cardAmount}>{formatCurrency(netRevenue)}</div>
              <div style={styles.cardBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Refunds:</span>
                  <span style={{color: '#e53e3e', fontWeight: '600'}}>
                    {formatCurrency(totalRefunds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Bookings Card */}
            <div 
              style={styles.summaryCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCardHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCard);
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{...styles.cardIcon, backgroundColor: 'rgba(237, 137, 54, 0.1)', color: '#ed8936'}}>
                  📅
                </div>
                <h3 style={styles.cardTitle}>Total Bookings</h3>
              </div>
              <div style={styles.cardAmount}>{bookingRevenue.total_bookings || 0}</div>
              <div style={styles.cardBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Workshop Payments:</span>
                  <span style={{color: '#667eea', fontWeight: '600'}}>
                    {workshopRevenue.total_workshop_payments || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Operational Costs Card */}
            <div 
              style={styles.summaryCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCardHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.summaryCard);
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{...styles.cardIcon, backgroundColor: 'rgba(229, 62, 62, 0.1)', color: '#e53e3e'}}>
                  💼
                </div>
                <h3 style={styles.cardTitle}>Operational Costs</h3>
              </div>
              <div style={styles.cardAmount}>{formatCurrency(staffCost.total_staff_cost)}</div>
              <div style={styles.cardBreakdown}>
                <div style={styles.breakdownItem}>
                  <span>Staff Salary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Statistics */}
        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>
            <span>💳</span> Payment Statistics
          </h2>
          <div style={styles.paymentStats}>
            <div style={styles.paymentType}>
              <h3 style={styles.paymentTypeTitle}>
                <span>📅</span> Booking Payments
              </h3>
              {paymentStats.bookingStats && paymentStats.bookingStats.length > 0 ? (
                paymentStats.bookingStats.map(stat => (
                  <div key={stat.payment_status} style={styles.paymentStat}>
                    <span style={styles.paymentStatus}>{stat.payment_status}</span>
                    <span style={styles.paymentCount}>{stat.count} payments</span>
                    <span style={styles.paymentAmount}>{formatCurrency(stat.total_amount)}</span>
                  </div>
                ))
              ) : (
                <div style={styles.noData}>No booking payment data available</div>
              )}
            </div>
            <div style={styles.paymentType}>
              <h3 style={styles.paymentTypeTitle}>
                <span>🎓</span> Workshop Payments
              </h3>
              {paymentStats.workshopStats && paymentStats.workshopStats.length > 0 ? (
                paymentStats.workshopStats.map(stat => (
                  <div key={stat.payment_status} style={styles.paymentStat}>
                    <span style={styles.paymentStatus}>{stat.payment_status}</span>
                    <span style={styles.paymentCount}>{stat.count} payments</span>
                    <span style={styles.paymentAmount}>{formatCurrency(stat.total_amount)}</span>
                  </div>
                ))
              ) : (
                <div style={styles.noData}>No workshop payment data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>
            <span>⭐</span> Top Performing Services
          </h2>
          <div style={styles.servicesList}>
            {topServices && topServices.length > 0 ? (
              topServices.map((service, index) => (
                <div 
                  key={service.category} 
                  style={styles.serviceItem}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.serviceItemHover);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, styles.serviceItem);
                  }}
                >
                  <div style={styles.serviceRank}>
                    #{index + 1}
                  </div>
                  <span style={styles.serviceCategory}>{service.category}</span>
                  <span style={styles.serviceBookings}>
                    {service.booking_count || 0} bookings
                  </span>
                  <span style={styles.serviceRevenue}>
                    {formatCurrency(service.total_revenue)}
                  </span>
                </div>
              ))
            ) : (
              <div style={styles.noData}>No service data available</div>
            )}
          </div>
        </div>

        {/* Refund Details */}
        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>
            <span>🔄</span> Refund Details
          </h2>
          <div style={styles.refundStats}>
            <div style={styles.refundType}>
              <h3 style={styles.paymentTypeTitle}>
                <span>📅</span> Booking Refunds
              </h3>
              <div style={styles.refundStat}>
                <div style={styles.refundItem}>
                  <span>Total Refunds:</span>
                  <span style={{fontWeight: '600', color: '#e53e3e'}}>
                    {refundDetails.bookingRefunds?.refund_count || 0}
                  </span>
                </div>
                <div style={styles.refundItem}>
                  <span>Amount:</span>
                  <span style={{fontWeight: '600', color: '#e53e3e'}}>
                    {formatCurrency(refundDetails.bookingRefunds?.total_refund_amount)}
                  </span>
                </div>
              </div>
            </div>
            <div style={styles.refundType}>
              <h3 style={styles.paymentTypeTitle}>
                <span>🎓</span> Workshop Refunds
              </h3>
              <div style={styles.refundStat}>
                <div style={styles.refundItem}>
                  <span>Total Refunds:</span>
                  <span style={{fontWeight: '600', color: '#e53e3e'}}>
                    {refundDetails.workshopRefunds?.refund_count || 0}
                  </span>
                </div>
                <div style={styles.refundItem}>
                  <span>Amount:</span>
                  <span style={{fontWeight: '600', color: '#e53e3e'}}>
                    {formatCurrency(refundDetails.workshopRefunds?.total_refund_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div style={styles.exportSection}>
          <button 
            style={styles.exportButton}
            onClick={() => window.print()}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
            }}
          >
            <span>📄</span> Export Report as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;