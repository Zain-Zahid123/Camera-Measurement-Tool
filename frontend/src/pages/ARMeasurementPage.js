import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Instruction.css";

function ARMeasurementPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [measurements, setMeasurements] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [arSupported, setARSupported] = useState(true); // Simplified for demo
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
      
      // Clean up camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraActive(false);
      setARSupported(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Toggle measurement mode
  const toggleMeasuring = () => {
    if (!measuring) {
      // Start measurement process
      setMeasuring(true);
      
      // Simulate AR measurement for demo
      // In a real app, this would be replaced with actual AR measurement logic
      setTimeout(() => {
        setMeasurements({
          width: (Math.random() * 50 + 20).toFixed(1),
          height: (Math.random() * 30 + 15).toFixed(1)
        });
      }, 2000);
    } else {
      // End measurement
      setMeasuring(false);
    }
  };

  // Save measurements and proceed
  const saveMeasurements = () => {
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      stopCamera(); // Clean up camera before navigation
      // In a real app, save the measurements to state/context
      navigate("/results", { 
        state: { 
          measurements, 
          method: "ar",
          timestamp: new Date().toISOString()
        } 
      });
    }, 1500);
  };

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">AR Measurement</h1>
        <div className="subtitle-wrapper animate-on-scroll">
          <div className="section-subtitle">STEP 2 OF 3</div>
        </div>
        <div className="sub-heading animate-on-scroll">
          Use your device's camera with augmented reality to measure fabric dimensions in real-time.
        </div>
      </div>
      
      <div className="ar-container stagger-animation" style={{ 
        marginBottom: '40px',
        position: 'relative'
      }}>
        {!arSupported ? (
          // AR not supported message
          <div className="step-card" style={{ 
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <div className="step-icon" style={{ margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M12 8V12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#3b82f6"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
              AR Measurement Not Available
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Your device or browser doesn't support AR functionality or camera access was denied.
              Please try another measurement method.
            </p>
            <button 
              className="read-more"
              onClick={() => navigate("/select-method")}
              style={{ backgroundColor: '#3b82f6', color: 'white' }}
            >
              CHOOSE ANOTHER METHOD
            </button>
          </div>
        ) : (
          // AR camera interface
          <div className="camera-container" style={{ 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#000',
            aspectRatio: '16/9',
            maxHeight: '70vh'
          }}>
            {/* Video element for camera feed */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            
            {/* Canvas overlay for AR elements */}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            
            {/* Camera inactive state */}
            {!cameraActive && (
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1e293b',
                color: 'white',
                padding: '20px'
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>
                  Camera Access Required
                </h3>
                <p style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                  The AR measurement tool needs access to your camera to work. Please enable camera access to continue.
                </p>
                <button 
                  className="read-more"
                  onClick={startCamera}
                  style={{ backgroundColor: '#3b82f6', color: 'white' }}
                >
                  START CAMERA
                </button>
              </div>
            )}
            
            {/* Measurement UI overlay when camera is active */}
            {cameraActive && (
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}>
                {/* Measurements display box */}
                {measuring && measurements.width > 0 && (
                  <div style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '15px',
                    alignSelf: 'center',
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '200px'
                  }}>
                    <span style={{ fontSize: '16px', marginBottom: '5px' }}>Width: {measurements.width} cm</span>
                    <span style={{ fontSize: '16px' }}>Height: {measurements.height} cm</span>
                  </div>
                )}
                
                {/* AR Guide instructions */}
                <div style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  alignSelf: 'center',
                  marginBottom: '20px',
                  textAlign: 'center',
                  maxWidth: '80%'
                }}>
                  {!measuring ? (
                    <span>Tap "Start Measuring" and point camera at your fabric</span>
                  ) : (
                    <span>Move your device slowly to capture the full fabric area</span>
                  )}
                </div>
                
                {/* Control buttons */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 20px'
                }}>
                  <button 
                    className="read-more" 
                    onClick={stopCamera}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: '1px solid white' 
                    }}
                  >
                    CANCEL
                  </button>
                  
                  {!measuring ? (
                    <button 
                      className="read-more" 
                      onClick={toggleMeasuring}
                      style={{ backgroundColor: '#3b82f6', color: 'white' }}
                    >
                      START MEASURING
                    </button>
                  ) : measurements.width > 0 ? (
                    <button 
                      className="read-more" 
                      onClick={saveMeasurements}
                      style={{ backgroundColor: '#10b981', color: 'white' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          SAVING...
                        </>
                      ) : "SAVE MEASUREMENTS"}
                    </button>
                  ) : (
                    <button 
                      className="read-more" 
                      onClick={toggleMeasuring}
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      CANCEL MEASURE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Instructions panel */}
      <div className="steps-container" style={{ gridTemplateColumns: '1fr' }}>
        <div className="step-card stagger-animation">
          <div className="step-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="step-title">How to Use AR Mode</div>
          <div className="step-description">
            <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>Click "Start Camera" to activate your device's camera</li>
              <li>Aim the camera at your fabric in a well-lit environment</li>
              <li>Tap "Start Measuring" and slowly move around the fabric</li>
              <li>The AR system will detect and measure the fabric dimensions</li>
              <li>Review the measurements and tap "Save Measurements" when satisfied</li>
            </ol>
            <p style={{ marginTop: '15px' }}>
              For best results, ensure there's good lighting and the fabric has visible edges.
            </p>
          </div>
          
          <button 
            className="read-more" 
            onClick={() => navigate("/select-method")}
            style={{ marginTop: '15px' }}
          >
            BACK TO METHODS
          </button>
        </div>
      </div>
    </div>
  );
}

export default ARMeasurementPage;