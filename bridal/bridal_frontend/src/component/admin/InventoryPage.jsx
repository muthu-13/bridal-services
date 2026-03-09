import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../BackButton";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Makeup",
    quantity: "",
    price: "",
    description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/inventory");
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [searchTerm, filterCategory, lowStockFilter, inventory]);

  const filterInventory = () => {
    let filtered = inventory.filter((item) => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const matchesLowStock = !lowStockFilter || item.quantity < 10;
      
      return matchesSearch && matchesCategory && matchesLowStock;
    });
    setFilteredInventory(filtered);
    setCurrentPage(1);
  };

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.price) {
      alert("Please fill in required fields: Name, Quantity, and Price");
      return;
    }

    try {
      await axios.post("/api/inventory", {
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price)
      });
      fetchInventory();
      setForm({
        name: "",
        category: "Makeup",
        quantity: "",
        price: "",
        description: ""
      });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await axios.delete(`/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/inventory/${id}`, {
        ...editForm,
        quantity: parseInt(editForm.quantity),
        price: parseFloat(editForm.price)
      });
      fetchInventory();
      setEditingId(null);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Elegant design styles
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
    statsCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '20px',
      borderRadius: '16px',
      minWidth: '200px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
    },
    statsNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '5px'
    },
    statsLabel: {
      fontSize: '0.9rem',
      opacity: '0.9'
    },
    addForm: {
      backgroundColor: '#F7FAFC',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid #E2E8F0',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      alignItems: 'end'
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
    input: {
      padding: '14px 16px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      flex: '1',
      minWidth: '200px',
      background: '#FFFFFF',
      fontWeight: '400'
    },
    select: {
      padding: '14px 16px',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#fff',
      cursor: 'pointer',
      minWidth: '150px',
      fontWeight: '400'
    },
    button: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    secondaryButton: {
      padding: '14px 28px',
      background: '#FFFFFF',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '0.5px',
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
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    editButton: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
    },
    deleteButton: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)'
    },
    saveButton: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #48BB78, #38A169)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(72, 187, 120, 0.3)'
    },
    cancelButton: {
      padding: '10px 18px',
      background: 'linear-gradient(135deg, #A0AEC0, #718096)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(160, 174, 192, 0.3)'
    },
    inputSmall: {
      padding: '10px 12px',
      border: '2px solid #E2E8F0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      transition: 'all 0.3s ease',
      fontWeight: '400'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginTop: '30px',
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
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      color: '#667eea',
      fontSize: '16px',
      fontWeight: '500'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096',
      fontSize: '16px'
    },
    lowStockBadge: {
      background: 'linear-gradient(135deg, #ED8936, #DD6B20)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px'
    },
    outOfStockBadge: {
      background: 'linear-gradient(135deg, #E53E3E, #C53030)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px'
    },
    categoryBadge: {
      background: '#EDF2F7',
      color: '#4A5568',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    filterChip: {
      background: '#E6FFFA',
      color: '#234E52',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      border: '1px solid #81E6D9',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Out of Stock', style: styles.outOfStockBadge };
    if (quantity < 5) return { status: 'Very Low', style: styles.lowStockBadge };
    if (quantity < 10) return { status: 'Low', style: styles.lowStockBadge };
    return null;
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <BackButton />
        
        {/* Header with Stats */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>Inventory Management</h2>
            <p style={styles.subtitle}>Manage your beauty salon inventory efficiently</p>
          </div>
          <div style={styles.statsCard}>
            <div style={styles.statsNumber}>{inventory.length}</div>
            <div style={styles.statsLabel}>Total Items</div>
          </div>
        </div>

        {/* ➕ Add Item Form */}
        <div style={styles.addForm}>
          <input
            placeholder="Product Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          >
            <option value="Makeup">Makeup</option>
            <option value="Accessories">Accessories</option>
            <option value="Mehendi">Mehendi</option>
            <option value="Skincare">Skincare</option>
            <option value="Hair Care">Hair Care</option>
          </select>
          <input
            type="number"
            placeholder="Quantity *"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            min="0"
          />
          <input
            type="number"
            placeholder="Price (₹) *"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            min="0"
            step="0.01"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
          <button 
            onClick={handleAdd}
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            + Add New Item
          </button>
        </div>

        {/* 🔍 Search & Filter Section */}
        <div style={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          >
            <option value="">All Categories</option>
            <option value="Makeup">Makeup</option>
            <option value="Accessories">Accessories</option>
            <option value="Mehendi">Mehendi</option>
            <option value="Skincare">Skincare</option>
            <option value="Hair Care">Hair Care</option>
          </select>
          <div 
            style={{
              ...styles.filterChip,
              ...(lowStockFilter ? { background: '#FED7D7', color: '#742A2A', borderColor: '#FC8181' } : {})
            }}
            onClick={() => setLowStockFilter(!lowStockFilter)}
          >
            ⚠️ Low Stock Only
          </div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
              setLowStockFilter(false);
            }}
            style={styles.secondaryButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F7FAFC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
          >
            Clear Filters
          </button>
        </div>

        {/* 📊 Results Info */}
        <div style={styles.resultsInfo}>
          Showing {currentItems.length} of {filteredInventory.length} products
          {searchTerm && ` for "${searchTerm}"`}
          {filterCategory && ` in ${filterCategory}`}
          {lowStockFilter && ` (Low Stock Only)`}
        </div>

        {/* 📋 Inventory Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={styles.loadingSpinner}>
                    Loading inventory data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    {searchTerm || filterCategory || lowStockFilter 
                      ? "No products found matching your filters." 
                      : "No products in inventory. Add your first item!"}
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <tr 
                      key={item.id}
                      style={{
                        transition: 'all 0.2s ease',
                        background: item.quantity === 0 ? '#FED7D7' : 
                                   item.quantity < 5 ? '#FEEBC8' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.quantity === 0 ? '#FEB2B2' : 
                                                              item.quantity < 5 ? '#FBD38D' : '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = item.quantity === 0 ? '#FED7D7' : 
                                                              item.quantity < 5 ? '#FEEBC8' : 'transparent';
                      }}
                    >
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#2D3748' }}>
                          {editingId === item.id ? (
                            <input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              style={styles.inputSmall}
                              onFocus={(e) => e.target.style.borderColor = '#667eea'}
                              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                            />
                          ) : (
                            <>
                              {item.name}
                              {stockStatus && <span style={stockStatus.style}>{stockStatus.status}</span>}
                            </>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {editingId === item.id ? (
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            style={styles.inputSmall}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                          >
                            <option value="Makeup">Makeup</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Mehendi">Mehendi</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Hair Care">Hair Care</option>
                          </select>
                        ) : (
                          <span style={styles.categoryBadge}>{item.category}</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                            style={styles.inputSmall}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                            min="0"
                          />
                        ) : (
                          <span style={{ 
                            fontWeight: '600', 
                            color: item.quantity === 0 ? '#E53E3E' : 
                                   item.quantity < 5 ? '#DD6B20' : '#38A169'
                          }}>
                            {item.quantity} units
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            style={styles.inputSmall}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <span style={{ fontWeight: '600', color: '#2D3748' }}>
                            ₹{parseFloat(item.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingId === item.id ? (
                          <input
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            style={styles.inputSmall}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                          />
                        ) : (
                          item.description || <span style={{ color: '#A0AEC0', fontStyle: 'italic' }}>No description</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingId === item.id ? (
                          <div style={styles.actionButtons}>
                            <button 
                              onClick={() => saveEdit(item.id)}
                              style={styles.saveButton}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(72, 187, 120, 0.3)';
                              }}
                            >
                              💾 Save
                            </button>
                            <button 
                              onClick={cancelEdit}
                              style={styles.cancelButton}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(160, 174, 192, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(160, 174, 192, 0.3)';
                              }}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={styles.actionButtons}>
                            <button 
                              onClick={() => startEdit(item)}
                              style={styles.editButton}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              style={styles.deleteButton}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(229, 62, 62, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(229, 62, 62, 0.3)';
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
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
        )}
      </div>
    </div>
  );
}