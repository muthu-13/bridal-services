import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import BackButton from "../BackButton";

const AdminViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [assignedStaff, setAssignedStaff] = useState({});
  
  // Pagination & Search states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
    fetchAllStaff();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/bookings");
      if (res.data.success) {
        setBookings(res.data.data);
        res.data.data.forEach((b) => fetchAssignedStaff(b.id));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAllStaff = async () => {
    try {
      const res = await axios.get("/api/staff");
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignedStaff = async (bookingId) => {
    try {
      const res = await axios.get(`/api/staff/booking/${bookingId}`);
      setAssignedStaff((prev) => ({ ...prev, [bookingId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const isStaffBusy = (staffId, bookingDate) => {
    return Object.entries(assignedStaff).some(([bId, assignedList]) => {
      const booking = bookings.find((b) => b.id === parseInt(bId));
      if (!booking) return false;
      return (
        booking.date === bookingDate &&
        assignedList.some((s) => s.id === staffId)
      );
    });
  };

  const handleAssign = async (bookingId) => {
    const staffId = selectedStaff[bookingId];
    if (!staffId) return;
    try {
      await axios.post("/api/staff/assign", { booking_id: bookingId, staff_id: staffId });
      fetchAssignedStaff(bookingId);
      setSelectedStaff((prev) => ({ ...prev, [bookingId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignAll = async () => {
    const assignments = Object.entries(selectedStaff).filter(([bId, sId]) => sId);
    if (assignments.length === 0) {
      alert("Please select staff for at least one booking first!");
      return;
    }
    
    try {
      await Promise.all(
        assignments.map(([bookingId, staffId]) =>
          axios.post("/api/staff/assign", { booking_id: bookingId, staff_id: staffId })
        )
      );
      setSelectedStaff({});
      bookings.forEach((b) => fetchAssignedStaff(b.id));
      alert(`✅ Successfully assigned staff to ${assignments.length} booking(s)!`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign staff.");
    }
  };

  // Filter and search logic - PROPERLY FIXED STATUS FILTER
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      const matchesSearch = 
        booking.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone?.includes(searchTerm) ||
        booking.services?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter - PROPERLY IMPLEMENTED
      let matchesStatus = true;
      if (statusFilter !== "all") {
        // Check if booking has status field, if not consider as "pending"
        const bookingStatus = booking.status || "pending";
        matchesStatus = bookingStatus.toLowerCase() === statusFilter.toLowerCase();
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Get unique statuses for debugging
  const uniqueStatuses = useMemo(() => {
    const statuses = bookings.map(b => b.status || "pending");
    return [...new Set(statuses)];
  }, [bookings]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count how many staff are selected
  const selectedStaffCount = Object.values(selectedStaff).filter(staffId => staffId !== "").length;

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1800px',
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
    searchFilterContainer: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '20px'
    },
    searchInput: {
      padding: '12px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      minWidth: '300px',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    filterSelect: {
      padding: '12px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
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
    assignAllContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '12px',
      border: '2px solid rgba(102, 126, 234, 0.2)'
    },
    assignAllButton: {
      padding: '12px 24px',
      background: selectedStaffCount > 0 
        ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' 
        : 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: selectedStaffCount > 0 ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s ease',
      boxShadow: selectedStaffCount > 0 
        ? '0 4px 15px rgba(72, 187, 120, 0.3)' 
        : '0 2px 8px rgba(160, 174, 192, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: selectedStaffCount > 0 ? 1 : 0.7
    },
    selectedCount: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
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
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    debugInfo: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#4a5568',
      marginTop: '10px',
      border: '1px solid #e2e8f0'
    },
    tableContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1600px'
    },
    th: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '16px 12px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '3px solid #5568d3',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '14px 12px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '13px',
      color: '#4a5568',
      textAlign: 'left'
    },
    select: {
      padding: '8px 12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '12px',
      outline: 'none',
      backgroundColor: '#fff',
      cursor: 'pointer',
      marginRight: '8px',
      transition: 'all 0.3s ease',
      minWidth: '150px',
      '&:focus': {
        borderColor: '#667eea'
      }
    },
    assignButton: {
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
    },
    assignedList: {
      textAlign: 'left',
      padding: 0,
      margin: 0,
      listStyle: 'none'
    },
    assignedListItem: {
      padding: '4px 0',
      fontSize: '12px',
      color: '#4a5568',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    noStaff: {
      color: '#a0aec0',
      fontStyle: 'italic',
      fontSize: '12px'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    statusPending: {
      backgroundColor: '#fed7d7',
      color: '#c53030'
    },
    statusConfirmed: {
      backgroundColor: '#c6f6d5',
      color: '#276749'
    },
    statusCompleted: {
      backgroundColor: '#bee3f8',
      color: '#2c5aa0'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: '8px 16px',
      border: '2px solid #e2e8f0',
      backgroundColor: '#ffffff',
      color: '#4a5568',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      minWidth: '40px',
      textAlign: 'center'
    },
    activePage: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      borderColor: '#667eea'
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
    empty: {
      textAlign: 'center',
      color: '#718096',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  };

  if (loading) return (
    <div style={styles.pageContainer}>
      <p style={styles.loading}>
        <span>⏳</span> Loading bookings...
      </p>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <BackButton />
          <h1 style={styles.title}>
            <span>📋</span> Booking Management
          </h1>
        </div>

        <div style={styles.controlsContainer}>
          <div style={styles.searchFilterContainer}>
            <input
              type="text"
              placeholder="🔍 Search by name, venue, phone, services..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Debug info - can remove this later */}
          <div style={styles.debugInfo}>
            <strong>Debug Info:</strong> Found {filteredBookings.length} bookings after filtering. 
            Available statuses in data: {uniqueStatuses.join(", ")}
          </div>

          {/* Assign All Button - ABOVE TABLE */}
          {filteredBookings.length > 0 && (
            <div style={styles.assignAllContainer}>
              <button
                onClick={handleAssignAll}
                style={styles.assignAllButton}
                onMouseEnter={(e) => {
                  if (selectedStaffCount > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStaffCount > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
                  }
                }}
              >
                <span>👥</span> Assign All Selected Staff
              </button>
              <div style={styles.selectedCount}>
                {selectedStaffCount} selected
              </div>
            </div>
          )}

          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              Total Bookings: {bookings.length}
            </div>
            <div style={styles.statCard}>
              Filtered: {filteredBookings.length}
            </div>
            <div style={styles.statCard}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.empty}>
            <p>No bookings found matching your criteria.</p>
            <p style={{ fontSize: '14px', color: '#a0aec0', marginTop: '8px' }}>
              Current filter: {statusFilter !== "all" ? `Status = ${statusFilter}` : "All statuses"} 
              {searchTerm && `, Search = "${searchTerm}"`}
            </p>
          </div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Bride Name</th>
                    <th style={styles.th}>Event Types</th>
                    <th style={styles.th}>Venue</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Services</th>
                    <th style={styles.th}>Package</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Created At</th>
                    <th style={styles.th}>Assign Staff</th>
                    <th style={styles.th}>Assigned Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((b, index) => {
                    const bookingStatus = b.status || "pending";
                    return (
                      <tr key={b.id} style={{ 
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={styles.td}>
                          <strong>#{b.id}</strong>
                        </td>
                        <td style={styles.td}>
                          <strong>{b.brideName}</strong>
                        </td>
                        <td style={styles.td}>
                          {b.eventTypes ? b.eventTypes.split(",").join(", ") : "-"}
                        </td>
                        <td style={styles.td}>{b.venue}</td>
                        <td style={styles.td}>
                          <strong>{b.date}</strong>
                        </td>
                        <td style={styles.td}>{b.phone}</td>
                        <td style={styles.td}>
                          {b.services ? b.services.split(",").join(", ") : "-"}
                        </td>
                        <td style={styles.td}>{b.package}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            ...(bookingStatus === 'pending' ? styles.statusPending : 
                                bookingStatus === 'confirmed' ? styles.statusConfirmed : 
                                styles.statusCompleted)
                          }}>
                            {bookingStatus}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>

                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select
                              value={selectedStaff[b.id] || ""}
                              onChange={(e) =>
                                setSelectedStaff((prev) => ({
                                  ...prev,
                                  [b.id]: e.target.value,
                                }))
                              }
                              style={styles.select}
                            >
                              <option value="">Select Staff</option>
                              {staff.map((s) => (
                                <option
                                  key={s.id}
                                  value={s.id}
                                  disabled={isStaffBusy(s.id, b.date)}
                                >
                                  {s.name} ({s.role}) {isStaffBusy(s.id, b.date) ? "🚫" : ""}
                                </option>
                              ))}
                            </select>
                            <button
                              style={styles.assignButton}
                              onClick={() => handleAssign(b.id)}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                              }}
                            >
                              Assign
                            </button>
                          </div>
                        </td>

                        <td style={styles.td}>
                          {assignedStaff[b.id] && assignedStaff[b.id].length > 0 ? (
                            <ul style={styles.assignedList}>
                              {assignedStaff[b.id].map((s) => (
                                <li key={s.id} style={styles.assignedListItem}>
                                  <span>👤</span> {s.name} - {s.role}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span style={styles.noStaff}>No staff assigned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Prev
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
                        onClick={() => paginate(pageNumber)}
                        style={{
                          ...styles.pageButton,
                          ...(currentPage === pageNumber && styles.activePage)
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} style={styles.pageButton}>...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminViewBookings; // ← THIS LINE WAS MISSING