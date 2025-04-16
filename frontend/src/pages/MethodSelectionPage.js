import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Instruction.css";

// SVG icons for the method cards
const UploadIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8L12 3L7 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ManualIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 16H15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12H15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ARIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13L14 15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Method options data
const methodOptions = [
  {
    id: "upload",
    icon: <UploadIcon />,
    title: "Upload Image",
    description: "Upload a photo of your fabric to measure it accurately. Best for completed fabric pieces.",
    additionalContent: "Upload a clear, well-lit photo of your fabric. The image should be high resolution and include the entire fabric piece. For best results, include a ruler or reference object in the photo.",
    path: "/measure/upload",
    bgColor: "#3b82f6"
  },
  {
    id: "manual",
    icon: <ManualIcon />,
    title: "Manual Selection",
    description: "Manually input dimensions or select from a template for quick measurements.",
    additionalContent: "Enter exact dimensions manually or choose from common fabric sizes. Perfect for when you already know some measurements or want to create a pattern from scratch.",
    path: "/measure/manual",
    bgColor: "#3b82f6"
  },
  {
    id: "ar",
    icon: <ARIcon />,
    title: "AR Ruler",
    description: "Use your camera with augmented reality to take live measurements of your fabric.",
    additionalContent: "Point your camera at the fabric and use our AR guides to mark corners and edges. This method works best in good lighting with your device held steady.",
    path: "/measure/ar",
    bgColor: "#3b82f6"
  }
];

function MethodSelectionPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const observerRef = React.useRef(null);
  const elementsRef = React.useRef([]);

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

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleNextClick = () => {
    if (selectedMethod) {
      const selectedOption = methodOptions.find(option => option.id === selectedMethod);
      navigate(selectedOption.path);
    } else {
      alert("Please select a measurement method first");
    }
  };

  return (
    <div className="instructions-container">
      <div className="hero-section">
        <h1 className="main-title animate-on-scroll">Choose Measurement Method</h1>
        <div className="section-subtitle animate-on-scroll">SELECT AN OPTION</div>
        <div className="sub-heading animate-on-scroll">
          Select the measurement method that best suits your needs. Each method offers different features and accuracy levels.
        </div>
      </div>
      
      <div className="horizontal-steps-container">
        {methodOptions.map((method, index) => (
          <div 
            key={method.id} 
            className={`step-card stagger-animation ${selectedMethod === method.id ? 'selected' : ''}`}
            style={{ 
              animationDelay: `${index * 0.2}s`,
              backgroundColor: selectedMethod === method.id ? method.bgColor : "#2d3748",
            }}
          >
            <div className="card-content" onClick={() => handleMethodSelect(method.id)}>
              <div className="step-icon">
                {method.icon}
              </div>
              <div className="step-title" style={{ 
                color: selectedMethod === method.id ? "white" : "#e2e8f0" 
              }}>
                {method.title}
              </div>
              <div className="step-description" style={{ 
                color: selectedMethod === method.id ? "white" : "#a0aec0" 
              }}>
                {method.description}
              </div>
              
              <div className="expanded-content" style={{ 
                backgroundColor: selectedMethod === method.id ? "rgba(255, 255, 255, 0.15)" : "#1a202c",
                color: selectedMethod === method.id ? "white" : "#cbd5e0"
              }}>
                {method.additionalContent}
              </div>
            </div>
            
            <button 
              className={`select-method-btn ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(method.id)}
              style={{
                backgroundColor: selectedMethod === method.id ? "#1d4ed8" : "#4a5568",
                color: "white"
              }}
            >
              {selectedMethod === method.id ? "SELECTED" : "SELECT"}
            </button>
          </div>
        ))}
      </div>
      
      <div className="button-group">
        <button 
          className="measure-btn stagger-animation animate"
          onClick={handleNextClick}
          disabled={!selectedMethod}
          style={{
            opacity: selectedMethod ? 1 : 0.7
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MethodSelectionPage;