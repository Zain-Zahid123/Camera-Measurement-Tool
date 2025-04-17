import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Instruction.css";

function HistoryPage() {
  const navigate = useNavigate();
  const [measurementHistory, setMeasurementHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const observerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Initialize animation observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'slide-up');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Load measurement history from localStorage
    const loadHistory = () => {
      const history = JSON.parse(localStorage.getItem('fabricMeasurementHistory') || '[]');
      setMeasurementHistory(history);
    };

    loadHistory();

    // Apply animations after data is loaded
    setTimeout(() => {
      // Observe all elements with animation classes
      const elements = document.querySelectorAll('.animate-on-scroll, .stagger-animation');
      elements.forEach((el, index) => {
        observerRef.current.observe(el);
        elementsRef.current.push(el);
        
        // Apply staggered animations
        if (el.classList.contains('stagger-animation')) {
          setTimeout(() => {
            el.classList.add('animate');
          }, index * 100);
        }
      });
    }, 100);

    return () => {
      if (observerRef.current) {
        elementsRef.current.forEach(el => {
          if (el) observerRef.current.unobserve(el);
        });
      }
    };
  }, []);

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get method icon based on measurement method
  const getMethodIcon = (method) => {
    switch (method) {
      case "ar":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2L12 7L8 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7V16" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16L16 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16L8 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "upload":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "scale":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14H9" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 14H17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 16L8 16" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20L8 16L6 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12L16 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 8L16.0001 12L18 16" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 8H14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 20H14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  // Get method name for display
  const getMethodName = (method) => {
    switch (method) {
      case "ar":
        return "AR Measurement";
      case "upload":
        return "Image Upload";
      case "scale":
        return "Reference Scale";
      case "manual":
        return "Manual Measurement";
      default:
        return "Manual Measurement";
    }
  };

  // Filter and sort measurements
  const filteredMeasurements = measurementHistory
    .filter(item => {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
             (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "size") {
        const aArea = a.width * a.height;
        const bArea = b.width * b.height;
        return sortOrder === "asc" ? aArea - bArea : bArea - aArea;
      }
      return 0;
    });

  // Handle delete measurement
  const deleteMeasurement = (id) => {
    const updatedHistory = measurementHistory.filter(item => item.id !== id);
    localStorage.setItem('fabricMeasurementHistory', JSON.stringify(updatedHistory));
    setMeasurementHistory(updatedHistory);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Handle export measurement
  const exportMeasurement = (measurement) => {
    // In a real application, this would generate a PDF or CSV
    alert(`Exporting measurement: ${measurement.name}`);
  };

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">Measurement History</h1>
        <div className="subtitle-wrapper animate-on-scroll">
          <div className="section-subtitle">SAVED MEASUREMENTS</div>
        </div>
        <div className="sub-heading animate-on-scroll">
          View, compare, and manage all your saved fabric measurements in one place.
        </div>
      </div>
      
      {/* Search and Sort Controls */}
      <div className="controls-container animate-on-scroll" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div className="search-container" style={{
          position: 'relative',
          flex: '1',
          minWidth: '250px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
          }}>
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search measurements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div className="sort-controls" style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Sort by:</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sortOrder === 'asc' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          <button
            onClick={() => navigate("/select-method")}
            className="read-more"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            NEW MEASUREMENT
          </button>
        </div>
      </div>
      
      {/* Measurements List */}
      <div className="measurements-container" style={{
        marginBottom: '40px'
      }}>
        {filteredMeasurements.length === 0 ? (
          <div className="empty-state stagger-animation" style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #e2e8f0'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              marginBottom: '20px',
              color: '#94a3b8'
            }}>
              <path d="M12 20V4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 11L12 4L19 11" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#1e293b' }}>
              No measurements found
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
              {searchTerm ? 
                `No results match "${searchTerm}". Try a different search term or clear the search.` : 
                "You haven't saved any fabric measurements yet. Start by measuring your first fabric."}
            </p>
            <button
              onClick={() => navigate("/select-method")}
              className="read-more"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white'
              }}
            >
              START MEASURING
            </button>
          </div>
        ) : (
          <div className="measurement-cards" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredMeasurements.map((measurement, index) => (
              <div 
                key={measurement.id} 
                className="measurement-card stagger-animation"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  transform: selectedItem === measurement.id ? 'scale(1.02)' : 'scale(1)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedItem(measurement.id === selectedItem ? null : measurement.id)}
              >
                {/* Card Header */}
                <div style={{
                  padding: '15px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getMethodIcon(measurement.method)}
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: '0 0 4px 0',
                        color: '#1e293b',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {measurement.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {measurement.type || "No type specified"}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    {formatDate(measurement.timestamp)}
                  </div>
                </div>
                
                {/* Card Content */}
                <div style={{ padding: '15px' }}>
                  {/* Dimensions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>WIDTH</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                        {measurement.width}
                        <span style={{ fontSize: '12px', marginLeft: '2px' }}>cm</span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      height: '40px', 
                      width: '1px', 
                      backgroundColor: '#f1f5f9'
                    }}></div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>HEIGHT</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                        {measurement.height}
                        <span style={{ fontSize: '12px', marginLeft: '2px' }}>cm</span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      height: '40px', 
                      width: '1px', 
                      backgroundColor: '#f1f5f9'
                    }}></div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>AREA</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>
                        {measurement.estimates?.area || ((measurement.width * measurement.height) / 10000).toFixed(2)}
                        <span style={{ fontSize: '12px', marginLeft: '2px' }}>m²</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Method Badge */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17H12.01" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Measured using <strong>{getMethodName(measurement.method)}</strong>
                  </div>
                  
                  {/* Notes (if any) - only show if expanded */}
                  {selectedItem === measurement.id && measurement.notes && (
                    <div style={{
                      marginBottom: '15px',
                      fontSize: '13px',
                      color: '#64748b',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      padding: '10px'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '5px' }}>Notes:</div>
                      {measurement.notes}
                    </div>
                  )}
                  
                  {/* Actions - only show if expanded */}
                  {selectedItem === measurement.id && (
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '10px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportMeasurement(measurement);
                        }}
                        style={{
                          flex: '1',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15L12 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 7L12 3L8 7" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 12H6C4.89543 12 4 12.8954 4 14V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V14C20 12.8954 19.1046 12 18 12H16" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        EXPORT
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/results", {
                            state: {
                              measurements: { width: measurement.width, height: measurement.height },
                              method: measurement.method,
                              timestamp: measurement.timestamp
                            }
                          });
                        }}
                        style={{
                          flex: '1',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        VIEW
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(measurement.id);
                          setIsDeleteModalOpen(true);
                        }}
                        style={{
                          flex: '1',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11V17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11V17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        DELETE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Empty State if no measurements */}
      {measurementHistory.length === 0 && filteredMeasurements.length === 0 && !searchTerm && (
        <div className="no-measurements stagger-animation" style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px dashed #e2e8f0',
          marginBottom: '40px'
        }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
            marginBottom: '20px',
            color: '#94a3b8'
          }}>
            <path d="M2 16L8 16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20L8 16L6 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12L16 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 8L16.0001 12L18 16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 8H14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 20H14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
            No Measurements Found
          </h3>
          <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px' }}>
            You haven't saved any fabric measurements yet. Start by creating your first measurement using one of our measurement methods.
          </p>
          <button
            onClick={() => navigate("/select-method")}
            className="read-more"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              fontSize: '16px'
            }}
          >
            START MEASURING
          </button>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1e293b' }}>
              Delete Measurement
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Are you sure you want to delete this measurement? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMeasurement(itemToDelete)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Back Button */}
      <div className="back-button-container animate-on-scroll" style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default HistoryPage;