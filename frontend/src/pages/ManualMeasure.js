import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Instruction.css";

function ManualMeasurementPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("cm");
  const [loading, setLoading] = useState(false);
  const [fabricShape, setFabricShape] = useState("rectangle");
  const [fabricColor, setFabricColor] = useState("#3b82f6");
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

  // Draw the fabric preview on canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dimensions to fit within canvas while preserving aspect ratio
      const maxWidth = canvas.width - 40;
      const maxHeight = canvas.height - 40;
      const parsedWidth = parseFloat(width) || 50;
      const parsedHeight = parseFloat(height) || 50;
      
      let scale;
      if (parsedWidth > parsedHeight) {
        scale = maxWidth / parsedWidth;
      } else {
        scale = maxHeight / parsedHeight;
      }
      
      const scaledWidth = parsedWidth * scale;
      const scaledHeight = parsedHeight * scale;
      
      // Draw fabric shape
      ctx.fillStyle = fabricColor;
      
      if (fabricShape === "rectangle") {
        ctx.fillRect(
          (canvas.width - scaledWidth) / 2,
          (canvas.height - scaledHeight) / 2,
          scaledWidth,
          scaledHeight
        );
      } else if (fabricShape === "circle") {
        const radius = Math.min(scaledWidth, scaledHeight) / 2;
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (fabricShape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, (canvas.height - scaledHeight) / 2);
        ctx.lineTo((canvas.width - scaledWidth) / 2, (canvas.height + scaledHeight) / 2);
        ctx.lineTo((canvas.width + scaledWidth) / 2, (canvas.height + scaledHeight) / 2);
        ctx.closePath();
        ctx.fill();
      }
      
      // Draw dimensions
      ctx.fillStyle = "#1e293b";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      
      // Width label
      ctx.fillText(
        `${parsedWidth} ${unit}`,
        canvas.width / 2,
        (canvas.height + scaledHeight) / 2 + 25
      );
      
      // Height label
      ctx.save();
      ctx.translate((canvas.width - scaledWidth) / 2 - 25, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${parsedHeight} ${unit}`, 0, 0);
      ctx.restore();
    }
  }, [width, height, unit, fabricShape, fabricColor]);

  // Handle form submission
  const handleContinue = () => {
    if (!width || !height) {
      alert("Please enter both width and height values.");
      return;
    }

    setLoading(true);
    
    // Simulate processing
  setTimeout(() => {
    setLoading(false);
    // After processing completes
    navigate("/results", {
      state: {
        measurements: { width: parseFloat(width), height: parseFloat(height) },
        method: "manual",
        timestamp: new Date().toISOString()
      }
    });
    }, 1500);
    };

  // Common input style for form elements
  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    marginBottom: '15px',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  };

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">Manual Measurement</h1>
        <div className="section-subtitle animate-on-scroll">STEP 1 OF 3</div>
        <div className="sub-heading animate-on-scroll">
          Enter the dimensions of your fabric manually and visualize it before proceeding.
        </div>
      </div>
      
      <div className="manual-measurement-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Form controls */}
        <div className="measurement-form stagger-animation">
          <div className="step-card" style={{ height: '100%', textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>Fabric Dimensions</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Width
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Enter width"
                  min="0"
                  style={inputStyle}
                />
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{
                    ...inputStyle,
                    width: '80px',
                    marginLeft: '10px',
                    marginBottom: '0'
                  }}
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Height
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
                min="0"
                style={inputStyle}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Fabric Shape
              </label>
              <select
                value={fabricShape}
                onChange={(e) => setFabricShape(e.target.value)}
                style={inputStyle}
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Fabric Color
              </label>
              <input
                type="color"
                value={fabricColor}
                onChange={(e) => setFabricColor(e.target.value)}
                style={{
                  ...inputStyle,
                  height: '40px',
                  padding: '5px'
                }}
              />
            </div>
            
            <div className="read-more" style={{ textAlign: 'center' }}>
              COMMON FABRIC SIZES
            </div>
          </div>
        </div>
        
        {/* Canvas preview */}
        <div className="preview-canvas stagger-animation">
          <div className="step-card" style={{ height: '100%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>Visual Preview</h2>
            
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{
                width: '100%',
                height: '250px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}
            ></canvas>
            
            <div style={{ 
              marginTop: '15px', 
              fontSize: '13px', 
              color: '#64748b', 
              textAlign: 'center'
            }}>
              This preview is for visualization purposes only and may not be to scale.
            </div>
          </div>
        </div>
      </div>
      
      <div className="button-group">
        <button 
          className="measure-btn stagger-animation"
          onClick={handleContinue}
          disabled={loading || !width || !height}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : "Continue to Results"}
        </button>
      </div>
      
      <div className="navigation-links stagger-animation" style={{ 
        marginTop: '20px',
        fontSize: '14px',
        color: '#64748b'
      }}>
        <button 
          onClick={() => navigate("/select-method")} 
          style={{ 
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '5px'
          }}
        >
          ← Back to measurement methods
        </button>
      </div>
    </div>
  );
}

export default ManualMeasurementPage;