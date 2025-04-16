import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Instruction.css";

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { measurements, method, timestamp } = location.state || {
    measurements: { width: 0, height: 0 },
    method: "unknown",
    timestamp: new Date().toISOString()
  };
  
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [fabricName, setFabricName] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
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

    // Observe all elements with animation classes
    const elements = document.querySelectorAll('.animate-on-scroll, .stagger-animation');
    elements.forEach(el => {
      observerRef.current.observe(el);
      elementsRef.current.push(el);
    });

    // Apply staggered animations with timeout
    document.querySelectorAll('.stagger-animation').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
      }, index * 200);
    });

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
  const getMethodIcon = () => {
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
  const getMethodName = () => {
    switch (method) {
      case "ar":
        return "AR Measurement";
      case "upload":
        return "Image Upload";
      case "scale":
        return "Reference Scale";
      default:
        return "Manual Measurement";
    }
  };

  // Calculate estimated fabric area and cost
  const calculateEstimates = () => {
    const area = (measurements.width * measurements.height) / 10000; // Convert to square meters
    const estimatedCostPerMeter = 12.99;
    const estimatedCost = area * estimatedCostPerMeter;
    
    return {
      area: area.toFixed(2),
      cost: estimatedCost.toFixed(2)
    };
  };

  // Save to measurement history
  const saveToHistory = () => {
    if (!fabricName.trim()) {
      alert("Please enter a fabric name before saving");
      return;
    }
    
    setLoading(true);
    
    // Prepare measurement data
    const measurementData = {
      id: `measurement-${Date.now()}`,
      name: fabricName.trim(),
      type: fabricType.trim(),
      notes: notes.trim(),
      width: measurements.width,
      height: measurements.height,
      method: method,
      timestamp: timestamp,
      estimates: calculateEstimates()
    };
    
    // Simulate API call
    setTimeout(() => {
      // Get existing history from localStorage or initialize empty array
      const existingHistory = JSON.parse(localStorage.getItem('fabricMeasurementHistory') || '[]');
      
      // Add new measurement to history
      const updatedHistory = [measurementData, ...existingHistory];
      
      // Save back to localStorage
      localStorage.setItem('fabricMeasurementHistory', JSON.stringify(updatedHistory));
      
      setLoading(false);
      setSavedToHistory(true);
      
      // Show success message and wait before navigating
      setTimeout(() => {
        navigate("/history");
      }, 2000);
    }, 1500);
  };

  // Calculate estimates
  const estimates = calculateEstimates();

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">Measurement Results</h1>
        <div className="subtitle-wrapper animate-on-scroll">
          <div className="section-subtitle">STEP 3 OF 3</div>
        </div>
        <div className="sub-heading animate-on-scroll">
          Review your fabric measurements and save them to your project history.
        </div>
      </div>
      
      {/* Results Card */}
      <div className="steps-container" style={{ 
        gridTemplateColumns: '1fr',
        marginBottom: '40px'
      }}>
        <div className="step-card stagger-animation" style={{
          backgroundColor: '#f8fafc',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="step-icon">
              {getMethodIcon()}
            </div>
            <div style={{ 
              backgroundColor: '#e2e8f0', 
              borderRadius: '6px', 
              padding: '6px 12px',
              fontSize: '14px'
            }}>
              {formatDate(timestamp)}
            </div>
          </div>
          
          <div className="step-title">Fabric Dimensions</div>
          
          {/* Measurement Results */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: '10px',
            marginBottom: '25px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>WIDTH</div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#3b82f6'
              }}>
                {measurements.width}
                <span style={{ fontSize: '18px', marginLeft: '2px' }}>cm</span>
              </div>
            </div>
            
            <div style={{ 
              height: '60px', 
              width: '1px', 
              backgroundColor: '#e2e8f0',
              margin: '0 20px'
            }}></div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>HEIGHT</div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#3b82f6'
              }}>
                {measurements.height}
                <span style={{ fontSize: '18px', marginLeft: '2px' }}>cm</span>
              </div>
            </div>
          </div>
          
          {/* Measurement Method */}
          <div style={{ 
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '25px',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: '14px' }}>
              Measured using <strong>{getMethodName()}</strong>
            </div>
          </div>
          
          {/* Estimated Area and Cost */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '25px'
          }}>
            <div style={{ 
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '15px',
              width: '48%'
            }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>ESTIMATED AREA</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>
                {estimates.area} m²
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '15px',
              width: '48%'
            }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>ESTIMATED COST</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>
                ${estimates.cost}
              </div>
            </div>
          </div>
          
          {/* Fabric Information Form */}
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
              Save to Your History
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: '#64748b',
                marginBottom: '5px'
              }}>
                Fabric Name*
              </label>
              <input 
                type="text" 
                value={fabricName}
                onChange={(e) => setFabricName(e.target.value)}
                placeholder="Enter a name for this fabric"
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: '#64748b',
                marginBottom: '5px'
              }}>
                Fabric Type (optional)
              </label>
              <select 
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select fabric type</option>
                <option value="Cotton">Cotton</option>
                <option value="Linen">Linen</option>
                <option value="Silk">Silk</option>
                <option value="Wool">Wool</option>
                <option value="Polyester">Polyester</option>
                <option value="Velvet">Velvet</option>
                <option value="Denim">Denim</option>
                <option value="Canvas">Canvas</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: '#64748b',
                marginBottom: '5px'
              }}>
                Notes (optional)
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this fabric"
                style={{ 
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <button 
              className="read-more" 
              onClick={() => navigate(-1)}
              style={{ 
                backgroundColor: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0'
              }}
            >
              BACK
            </button>
            
            <button 
              className="read-more" 
              onClick={saveToHistory}
              style={{ 
                backgroundColor: savedToHistory ? '#10b981' : '#3b82f6',
                color: 'white',
                width: '60%',
                position: 'relative'
              }}
              disabled={loading || savedToHistory}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  SAVING...
                </>
              ) : savedToHistory ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '5px' }}>
                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  SAVED SUCCESSFULLY
                </>
              ) : (
                "SAVE TO HISTORY"
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional Options */}
      <div className="steps-container" style={{ 
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="step-card stagger-animation">
          <div className="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 15L16 10L5 21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="step-title">Export & Share</div>
          <div className="step-description">
            Export your measurements as PDF or share them directly with collaborators via email or message.
          </div>
          <button className="read-more">
            EXPORT OPTIONS
          </button>
        </div>
        
        <div className="step-card stagger-animation">
          <div className="step-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20H21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72143 20.1213 5C20.1213 5.27857 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="step-title">New Measurement</div>
          <div className="step-description">
            Start a new fabric measurement process using any of our measurement methods.
          </div>
          <button 
            className="read-more"
            onClick={() => navigate("/select-method")}
          >
            START NEW
          </button>
        </div>
      </div>
      
      {/* View History Link */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <button 
          onClick={() => navigate("/history")}
          style={{ 
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          VIEW MEASUREMENT HISTORY
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '5px' }}>
            <path d="M5 12H19" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;