import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import BackButton from "../BackButton";

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/reviews");
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`http://localhost:5000/api/admin/reviews/approve/${id}`);
      fetchAllReviews();
    } catch (error) {
      console.error("Error approving review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setActionLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
      fetchAllReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter reviews based on search and filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = 
        review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "approved" && review.approved) ||
        (statusFilter === "pending" && !review.approved);

      const matchesRating = ratingFilter === "all" || 
        review.rating?.toString() === ratingFilter;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.approved).length;
    const pending = reviews.filter(r => !r.approved).length;
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

    return { total, approved, pending, averageRating };
  }, [reviews]);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
      maxWidth: '1200px',
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
    clearButton: {
      padding: '14px 24px',
      background: '#FFFFFF',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
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
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
      gap: '25px',
      marginBottom: '30px'
    },
    reviewCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '25px',
      border: '1px solid #E2E8F0',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    reviewerInfo: {
      flex: '1'
    },
    reviewName: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#2D3748',
      margin: '0 0 5px 0'
    },
    reviewService: {
      fontSize: '14px',
      color: '#667eea',
      fontWeight: '600',
      margin: '0'
    },
    reviewRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#FFA500',
      background: '#FFF9E6',
      padding: '8px 12px',
      borderRadius: '20px',
      border: '1px solid #FFE8A5'
    },
    reviewComment: {
      color: '#4A5568',
      fontSize: '15px',
      lineHeight: '1.6',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#F7FAFC',
      borderRadius: '12px',
      borderLeft: '4px solid #667eea',
      fontStyle: 'italic'
    },
    statusContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      paddingTop: '15px',
      borderTop: '1px solid #E2E8F0'
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statusApproved: {
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF'
    },
    statusPending: {
      background: 'linear-gradient(135deg, #ED8936, #DD6B20)',
      color: '#FFFFFF'
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '100px',
      justifyContent: 'center'
    },
    approveButton: {
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(72, 187, 120, 0.3)'
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)'
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
      color: '#718096',
      gridColumn: '1 / -1'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: '0.5'
    },
    actionLoading: {
      opacity: '0.6',
      pointerEvents: 'none'
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRatingFilter("all");
    setCurrentPage(1);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>Manage Reviews</h2>
            <p style={styles.subtitle}>Approve or delete customer reviews</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Reviews</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #48BB78, #38A169)'}}>
            <div style={styles.statNumber}>{stats.approved}</div>
            <div style={styles.statLabel}>Approved</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #ED8936, #DD6B20)'}}>
            <div style={styles.statNumber}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #9F7AEA, #805AD5)'}}>
            <div style={styles.statNumber}>{stats.averageRating}</div>
            <div style={styles.statLabel}>Avg Rating</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div style={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search by name, service, or comment..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={styles.filterSelect}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button
            onClick={fetchAllReviews}
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
          <button
            onClick={clearFilters}
            style={styles.clearButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F7FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
          >
            🗑️ Clear Filters
          </button>
        </div>

        {/* Results Info */}
        <div style={styles.resultsInfo}>
          Showing {currentItems.length} of {filteredReviews.length} reviews
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          {ratingFilter !== 'all' && ` with ${ratingFilter} stars`}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div style={styles.loadingSpinner}>
            <div>🔄 Loading reviews...</div>
          </div>
        ) : (
          <>
            <div style={styles.reviewsGrid}>
              {currentItems.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>💬</div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>No reviews found</div>
                  <div style={{ color: '#A0AEC0' }}>
                    {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'No reviews submitted yet'
                    }
                  </div>
                </div>
              ) : (
                currentItems.map((review) => (
                  <div 
                    key={review.id} 
                    style={{
                      ...styles.reviewCard,
                      ...(actionLoading === review.id ? styles.actionLoading : {})
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewerInfo}>
                        <h3 style={styles.reviewName}>{review.name}</h3>
                        <p style={styles.reviewService}>{review.service_type}</p>
                      </div>
                      <div style={styles.reviewRating}>
                        {renderStars(review.rating)}
                        <span>({review.rating}/5)</span>
                      </div>
                    </div>
                    <p style={styles.reviewComment}>"{review.comment}"</p>
                    <div style={styles.statusContainer}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(review.approved ? styles.statusApproved : styles.statusPending)
                      }}>
                        {review.approved ? "✅ Approved" : "⏳ Pending Review"}
                      </span>
                      <div style={styles.buttonContainer}>
                        {!review.approved && (
                          <button 
                            onClick={() => handleApprove(review.id)}
                            disabled={actionLoading === review.id}
                            style={{...styles.button, ...styles.approveButton}}
                            onMouseEnter={(e) => {
                              if (!actionLoading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!actionLoading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(72, 187, 120, 0.3)';
                              }
                            }}
                          >
                            {actionLoading === review.id ? '⏳' : '✅'} Approve
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review.id)}
                          disabled={actionLoading === review.id}
                          style={{...styles.button, ...styles.deleteButton}}
                          onMouseEnter={(e) => {
                            if (!actionLoading) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(229, 62, 62, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!actionLoading) {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(229, 62, 62, 0.3)';
                            }
                          }}
                        >
                          {actionLoading === review.id ? '⏳' : '🗑️'} Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <div style={styles.paginationInfo}>
                  Page {currentPage} of {totalPages} • {filteredReviews.length} total reviews
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
          </>
        )}
      </div>
    </div>
  );
}