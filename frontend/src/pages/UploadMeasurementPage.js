import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Instruction.css";

function UploadMeasurementPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
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

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Simulate upload and processing
  const handleContinue = () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
     // Simulate processing, then navigate to next step
  setTimeout(() => {
    clearInterval(progressInterval);
    setLoading(false);
    setUploadProgress(0);
    
    // After processing completes
    navigate("/results", {
      state: {
        measurements: { width: 150, height: 100 }, // You should replace with actual measurements
        method: "upload",
        timestamp: new Date().toISOString()
      }
    });
  }, 3000);
};

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">Upload Fabric Image</h1>
        <div className="section-subtitle animate-on-scroll">STEP 1 OF 3</div>
        <div className="sub-heading animate-on-scroll">
          Upload a high-quality image of your fabric. Ensure good lighting and include a measurement reference like a ruler for the best results.
        </div>
      </div>
      
      <div className="upload-container stagger-animation" style={{ 
        marginBottom: '40px',
        padding: '40px',
        border: `2px dashed ${dragActive ? '#3b82f6' : '#e2e8f0'}`,
        borderRadius: '12px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        backgroundColor: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      >
        
        {previewUrl ? (
          <div className="preview-container" style={{ marginBottom: '20px' }}>
            <img 
              src={previewUrl} 
              alt="Fabric preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
              {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          </div>
        ) : (
          <>
            <div className="step-icon" style={{ margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: 'white' }}>
              Drag & Drop your fabric image here
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              or click to browse files (JPG, PNG, HEIC up to 20MB)
            </p>
            <button
              className="read-more"
              onClick={onButtonClick}
              style={{ backgroundColor: '#3b82f6', color: 'white' }}
            >
              SELECT FILE
            </button>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      
      {previewUrl && (
        <div className="tips-container stagger-animation" style={{
          backgroundColor: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#1e293b' }}>
            Image Tips
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#64748b' }}>
            <li>Ensure the fabric is laid flat on a uniform surface</li>
            <li>Include a ruler or reference object of known size</li>
            <li>Make sure the entire fabric piece is visible</li>
            <li>Take the photo in good lighting with minimal shadows</li>
          </ul>
        </div>
      )}
      
      <div className="button-group">
        <button 
          className="measure-btn stagger-animation"
          onClick={handleContinue}
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Processing..."}
            </>
          ) : "Continue"}
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

export default UploadMeasurementPage;