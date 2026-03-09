import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import BackButton from "../BackButton";

export default function AdminAllRegistrations() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [workshopSearch, setWorkshopSearch] = useState({}); // { workshopId: searchTerm }
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedWorkshop, setExpandedWorkshop] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/workshops/registrations/all')
      .then((res) => {
        setWorkshops(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching all registrations:', err);
        setLoading(false);
      });
  }, []);

  // Handle workshop-specific search changes
  const handleWorkshopSearchChange = (workshopId, searchTerm) => {
    setWorkshopSearch(prev => ({
      ...prev,
      [workshopId]: searchTerm
    }));
  };

  // Filter workshops based on global search term
  const filteredWorkshops = useMemo(() => {
    if (!globalSearch) return workshops;

    return workshops.filter(workshop => {
      const workshopMatches = 
        workshop.title?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        workshop.location?.toLowerCase().includes(globalSearch.toLowerCase());
      
      const registrationMatches = workshop.registrations.some(reg =>
        reg.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        reg.email?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        reg.phone?.includes(globalSearch) ||
        reg.city?.toLowerCase().includes(globalSearch.toLowerCase())
      );

      return workshopMatches || registrationMatches;
    });
  }, [workshops, globalSearch]);

  // Filter registrations within each workshop based on workshop-specific search
  const getFilteredRegistrations = (workshop) => {
    const searchTerm = workshopSearch[workshop.id] || "";
    
    if (!searchTerm) return workshop.registrations;

    return workshop.registrations.filter(reg =>
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone?.includes(searchTerm)
    );
  };

  // Pagination logic
  const indexOfLastWorkshop = currentPage * itemsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - itemsPerPage;
  const currentWorkshops = filteredWorkshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
  const totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleWorkshop = (workshopId) => {
    setExpandedWorkshop(expandedWorkshop === workshopId ? null : workshopId);
  };

  // Calculate total registrations
  const totalRegistrations = workshops.reduce((total, workshop) => total + workshop.registrations.length, 0);

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
    searchContainer: {
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
      flex: 1,
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
    },
    workshopSearchInput: {
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '13px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      minWidth: '250px',
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
      }
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
    workshopCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '0',
      marginBottom: '20px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    workshopHeader: {
      padding: '24px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    workshopHeaderHover: {
      backgroundColor: '#edf2f7'
    },
    workshopTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    workshopInfo: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    workshopMeta: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      marginTop: '12px'
    },
    expandIcon: {
      fontSize: '18px',
      color: '#667eea',
      transition: 'transform 0.3s ease'
    },
    workshopContent: {
      padding: '0',
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    workshopContentExpanded: {
      padding: '24px',
      maxHeight: '2000px'
    },
    workshopSearchContainer: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(102, 126, 234, 0.1)'
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1200px'
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
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '14px 12px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '13px',
      color: '#4a5568',
      textAlign: 'left'
    },
    tdNumber: {
      fontWeight: '600',
      color: '#667eea',
      textAlign: 'center'
    },
    emptyState: {
      textAlign: 'center',
      color: '#718096',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    noRegistrations: {
      textAlign: 'center',
      color: '#a0aec0',
      fontSize: '14px',
      padding: '40px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      margin: '20px'
    },
    registrationStats: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      fontSize: '13px',
      color: '#667eea',
      fontWeight: '600'
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
    registrationCount: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    filteredCount: {
      backgroundColor: '#48bb78',
      color: '#ffffff',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    }
  };

  if (loading) return (
    <div style={styles.pageContainer}>
      <p style={styles.loading}>
        <span>⏳</span> Loading all registrations...
      </p>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <BackButton />
          <h1 style={styles.title}>
            <span>📚</span> Workshop Registrations
          </h1>
        </div>

        <div style={styles.controlsContainer}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Search all workshops, names, emails, locations..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <span>🏢</span> Total Workshops: {workshops.length}
            </div>
            <div style={styles.statCard}>
              <span>👥</span> Total Registrations: {totalRegistrations}
            </div>
            <div style={styles.statCard}>
              <span>🔍</span> Filtered Workshops: {filteredWorkshops.length}
            </div>
            <div style={styles.statCard}>
              <span>📄</span> Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {filteredWorkshops.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No workshops found matching your search criteria.</p>
            {globalSearch && (
              <p style={{ fontSize: '14px', color: '#a0aec0', marginTop: '8px' }}>
                Search term: "{globalSearch}"
              </p>
            )}
          </div>
        ) : (
          <>
            {currentWorkshops.map((workshop) => {
              const filteredRegistrations = getFilteredRegistrations(workshop);
              const workshopSearchTerm = workshopSearch[workshop.id] || "";
              
              return (
                <div key={workshop.id} style={styles.workshopCard}>
                  <div 
                    style={styles.workshopHeader}
                    onClick={() => toggleWorkshop(workshop.id)}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.workshopHeaderHover);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.workshopHeader);
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.workshopTitle}>
                        {workshop.title}
                        <span style={styles.registrationCount}>
                          {workshop.registrations.length} registration{workshop.registrations.length !== 1 ? 's' : ''}
                        </span>
                        {workshopSearchTerm && (
                          <span style={styles.filteredCount}>
                            {filteredRegistrations.length} filtered
                          </span>
                        )}
                      </h3>
                      <div style={styles.workshopMeta}>
                        <p style={styles.workshopInfo}>
                          <span>📅</span> {new Date(workshop.date).toLocaleDateString()}
                        </p>
                        <p style={styles.workshopInfo}>
                          <span>📍</span> {workshop.location}
                        </p>
                        <p style={styles.workshopInfo}>
                          <span>⏰</span> {workshop.time || 'Time not specified'}
                        </p>
                      </div>
                    </div>
                    <div 
                      style={{
                        ...styles.expandIcon,
                        transform: expandedWorkshop === workshop.id ? 'rotate(180deg)' : 'rotate(0)'
                      }}
                    >
                      ▼
                    </div>
                  </div>

                  <div 
                    style={{
                      ...styles.workshopContent,
                      ...(expandedWorkshop === workshop.id && styles.workshopContentExpanded)
                    }}
                  >
                    {/* Workshop-specific search */}
                    <div style={styles.workshopSearchContainer}>
                      <input
                        type="text"
                        placeholder="🔍 Search names, emails, phones in this workshop..."
                        value={workshopSearchTerm}
                        onChange={(e) => handleWorkshopSearchChange(workshop.id, e.target.value)}
                        style={styles.workshopSearchInput}
                      />
                      <div style={styles.registrationStats}>
                        Showing {filteredRegistrations.length} of {workshop.registrations.length} registrations
                        {workshopSearchTerm && (
                          <span style={{color: '#48bb78', fontWeight: '600'}}>
                            • Filtered by: "{workshopSearchTerm}"
                          </span>
                        )}
                      </div>
                    </div>

                    {filteredRegistrations.length === 0 ? (
                      <div style={styles.noRegistrations}>
                        {workshopSearchTerm ? 
                          `No registrations found matching "${workshopSearchTerm}"` : 
                          'No registrations for this workshop yet.'
                        }
                      </div>
                    ) : (
                      <div style={styles.tableContainer}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>#</th>
                              <th style={styles.th}>Name</th>
                              <th style={styles.th}>Email</th>
                              <th style={styles.th}>Phone</th>
                              <th style={styles.th}>City</th>
                              <th style={styles.th}>Language</th>
                              <th style={styles.th}>Experience</th>
                              <th style={styles.th}>Interest</th>
                              <th style={styles.th}>Source</th>
                              <th style={styles.th}>Comments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRegistrations.map((reg, i) => (
                              <tr key={reg.id} style={{ 
                                backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc',
                                transition: 'background-color 0.2s ease'
                              }}>
                                <td style={{...styles.td, ...styles.tdNumber}}>
                                  {i + 1}
                                </td>
                                <td style={styles.td}>
                                  <strong>{reg.name}</strong>
                                </td>
                                <td style={styles.td}>{reg.email}</td>
                                <td style={styles.td}>{reg.phone}</td>
                                <td style={styles.td}>{reg.city}</td>
                                <td style={styles.td}>{reg.language}</td>
                                <td style={styles.td}>{reg.experience}</td>
                                <td style={styles.td}>{reg.interest}</td>
                                <td style={styles.td}>{reg.source || '-'}</td>
                                <td style={styles.td}>{reg.comments || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

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
}