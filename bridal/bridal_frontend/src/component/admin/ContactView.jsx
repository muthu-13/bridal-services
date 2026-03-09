import React, { useEffect, useState, useMemo } from "react";
import BackButton from "../BackButton";

export default function ContactView() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contact/all");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter contacts based on search term
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.name?.toLowerCase().includes(lowercasedSearch) ||
      contact.email?.toLowerCase().includes(lowercasedSearch) ||
      contact.phone?.toLowerCase().includes(lowercasedSearch) ||
      contact.message?.toLowerCase().includes(lowercasedSearch)
    );
  }, [contacts, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
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
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    title: {
      color: '#ffffff',
      fontSize: '32px',
      fontWeight: '700',
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    searchContainer: {
      position: 'relative',
      minWidth: '300px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 45px 12px 16px',
      borderRadius: '25px',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    searchIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#667eea',
      fontSize: '18px'
    },
    loading: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '18px',
      padding: '60px 20px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '15px',
      backdropFilter: 'blur(10px)'
    },
    empty: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '18px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '40px',
      borderRadius: '15px',
      backdropFilter: 'blur(10px)'
    },
    tableContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '30px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px'
    },
    th: {
      backgroundColor: '#667eea',
      color: '#ffffff',
      padding: '18px 15px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: 'none',
      position: 'relative'
    },
    td: {
      padding: '16px 15px',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px',
      color: '#444',
      lineHeight: '1.5'
    },
    messageCell: {
      maxWidth: '300px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      cursor: 'pointer'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: '#667eea',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      minWidth: '45px'
    },
    activePage: {
      backgroundColor: '#667eea',
      color: '#ffffff'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    stats: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '14px',
      marginBottom: '20px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '12px 20px',
      borderRadius: '10px',
      backdropFilter: 'blur(10px)',
      display: 'inline-block'
    },
    expandButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background 0.3s ease'
    }
  };

  const [expandedMessages, setExpandedMessages] = useState({});

  const toggleMessage = (contactId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [contactId]: !prev[contactId]
    }));
  };

  const renderMessage = (message, contactId) => {
    const isExpanded = expandedMessages[contactId];
    const shouldTruncate = message.length > 100 && !isExpanded;

    return (
      <div>
        <div style={{ 
          ...styles.messageCell, 
          whiteSpace: isExpanded ? 'normal' : 'nowrap',
          maxWidth: '300px'
        }}>
          {shouldTruncate ? `${message.substring(0, 100)}...` : message}
        </div>
        {message.length > 100 && (
          <button
            style={styles.expandButton}
            onClick={() => toggleMessage(contactId)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0ff'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <BackButton />
            <h2 style={styles.title}>📥 Contact Form Submissions</h2>
          </div>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
        </div>

        {!loading && filteredContacts.length > 0 && (
          <div style={styles.stats}>
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} messages
            {searchTerm && ` (filtered from ${contacts.length} total)`}
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>
            <div>Loading messages...</div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div style={styles.empty}>
            {searchTerm ? 'No messages found matching your search.' : 'No contact messages found.'}
          </div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Message</th>
                    <th style={styles.th}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentContacts.map((contact, index) => (
                    <tr
                      key={contact.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                      onMouseLeave={e =>
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa'
                      }
                    >
                      <td style={styles.td}>{startIndex + index + 1}</td>
                      <td style={styles.td}>
                        <strong>{contact.name}</strong>
                      </td>
                      <td style={styles.td}>{contact.email}</td>
                      <td style={styles.td}>{contact.phone || 'N/A'}</td>
                      <td style={styles.td}>
                        {renderMessage(contact.message, contact.id)}
                      </td>
                      <td style={styles.td}>
                        {new Date(contact.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === 1 && styles.disabledButton)
                  }}
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>

                {getPageNumbers().map((page, index) =>
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} style={styles.pageButton}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      style={{
                        ...styles.pageButton,
                        ...(currentPage === page && styles.activePage)
                      }}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages && styles.disabledButton)
                  }}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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