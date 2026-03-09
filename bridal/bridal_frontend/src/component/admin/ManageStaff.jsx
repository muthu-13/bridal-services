import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../BackButton";

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    salary: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchTerm, staff]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    if (!searchTerm) {
      setFilteredStaff(staff);
      return;
    }

    const filtered = staff.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.includes(searchTerm)
    );
    setFilteredStaff(filtered);
    setCurrentPage(1);
  };

  const handleAdd = async () => {
    if (!form.name || !form.role || !form.email) {
      alert("Please fill in required fields: Name, Role, and Email");
      return;
    }

    try {
      await axios.post("/api/staff", form);
      fetchStaff();
      setForm({ name: "", role: "", phone: "", email: "", salary: "" });
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const handleSalaryUpdate = async (staff_id, salary) => {
    if (!salary || salary <= 0) {
      alert("Please enter a valid salary amount");
      return;
    }

    try {
      await axios.put("/api/staff/salary", { staff_id, salary });
      fetchStaff();
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Elegant design styles
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    title: {
      textAlign: "center",
      color: "#2D3748",
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "10px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      textAlign: "center",
      color: "#718096",
      fontSize: "1.1rem",
      marginBottom: "40px",
      fontWeight: "400",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      gap: "20px",
      flexWrap: "wrap",
    },
    searchInput: {
      flex: "1",
      minWidth: "300px",
      padding: "14px 20px",
      border: "2px solid #E2E8F0",
      borderRadius: "12px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease",
      background: "#FFFFFF",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "16px",
      marginBottom: "40px",
      padding: "30px",
      backgroundColor: "#F7FAFC",
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
    },
    input: {
      padding: "14px 16px",
      border: "2px solid #E2E8F0",
      borderRadius: "12px",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
      background: "#FFFFFF",
      fontWeight: "400",
    },
    addButton: {
      padding: "14px 24px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
      letterSpacing: "0.5px",
    },
    tableContainer: {
      background: "#FFFFFF",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      border: "1px solid #E2E8F0",
      marginBottom: "30px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#FFFFFF",
    },
    th: {
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#FFFFFF",
      padding: "18px 16px",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "14px",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    },
    td: {
      padding: "16px",
      borderBottom: "1px solid #F1F5F9",
      fontSize: "15px",
      color: "#2D3748",
      fontWeight: "400",
    },
    tr: {
      transition: "all 0.2s ease",
    },
    salaryInput: {
      width: "100%",
      padding: "10px 12px",
      border: "2px solid #E2E8F0",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
      fontWeight: "500",
    },
    updateButton: {
      background: "linear-gradient(135deg, #48BB78, #38A169)",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      padding: "10px 18px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(72, 187, 120, 0.3)",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginTop: "30px",
    },
    pageButton: {
      padding: "10px 16px",
      border: "2px solid #E2E8F0",
      background: "#FFFFFF",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      minWidth: "44px",
    },
    activePage: {
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#FFFFFF",
      border: "2px solid #667eea",
    },
    resultsInfo: {
      textAlign: "center",
      color: "#718096",
      fontSize: "14px",
      marginBottom: "20px",
      fontWeight: "500",
    },
    loadingSpinner: {
      textAlign: "center",
      padding: "40px",
      color: "#667eea",
      fontSize: "16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#718096",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        <h2 style={styles.title}>Manage Staff</h2>
        <p style={styles.subtitle}>Add, search, and manage your team members</p>

        {/* 🔍 Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, role, email, or phone..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E2E8F0";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
            }}
          />
        </div>

        {/* ➕ Add Staff Form */}
        <div style={styles.formGrid}>
          <input
            placeholder="Full Name *"
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          <input
            placeholder="Role *"
            style={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          <input
            placeholder="Phone"
            style={styles.input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          <input
            placeholder="Email *"
            type="email"
            style={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          <input
            placeholder="Salary"
            type="number"
            style={styles.input}
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
          <button
            style={styles.addButton}
            onClick={handleAdd}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            + Add Staff Member
          </button>
        </div>

        {/* 📊 Results Info */}
        <div style={styles.resultsInfo}>
          Showing {currentItems.length} of {filteredStaff.length} staff members
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* 👩‍💼 Staff Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Salary (₹)</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={styles.loadingSpinner}>
                    Loading staff data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    {searchTerm ? "No staff members found matching your search." : "No staff members found."}
                  </td>
                </tr>
              ) : (
                currentItems.map((s) => (
                  <tr 
                    key={s.id} 
                    style={styles.tr}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                    }}
                  >
                    <td style={styles.td}>
                      <strong>{s.name}</strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        background: "#EDF2F7",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#4A5568",
                      }}>
                        {s.role}
                      </span>
                    </td>
                    <td style={styles.td}>{s.phone || "-"}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        defaultValue={s.salary}
                        style={styles.salaryInput}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#48BB78";
                          e.target.style.boxShadow = "0 0 0 3px rgba(72, 187, 120, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E2E8F0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.updateButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(72, 187, 120, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 2px 8px rgba(72, 187, 120, 0.3)";
                        }}
                        onClick={() => {
                          const input = document.querySelector(`input[defaultValue="${s.salary}"]`);
                          handleSalaryUpdate(s.id, input?.value || s.salary);
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first, last, and pages around current page
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
                        e.target.style.borderColor = "#667eea";
                        e.target.style.color = "#667eea";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== pageNumber) {
                        e.target.style.borderColor = "#E2E8F0";
                        e.target.style.color = "#2D3748";
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
                return <span key={pageNumber} style={{ padding: "10px" }}>...</span>;
              }
              return null;
            })}
            
            <button
              style={styles.pageButton}
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}