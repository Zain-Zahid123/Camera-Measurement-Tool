import React, { useEffect, useRef, useState } from "react";
import "./Instruction.css";

// SVG icons as components
const CameraIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SelectIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V18C21 18.5304 20.7893 19.0391 20.4142 19.4142C20.0391 19.7893 19.5304 20 19 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V6Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 14L11 16L15 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M7 9V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 12V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 12V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 9V15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M8 16L8 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 16L12 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16L16 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Extended data for steps with more detailed information
const steps = [
  {
    icon: <CameraIcon />,
    title: "Upload Image",
    description: "Upload a high-quality image of the fabric you want to measure. Ensure the image is clear and well-lit for the best results.",
    highlight: true,
    extendedDescription: "For optimal results, take photos in natural daylight or well-lit environments. Keep the fabric flat and unwrinkled with minimal shadows. Include the entire piece of fabric in the frame with a measurement reference (like a ruler) placed directly on the fabric.",
    tooltip: "JPG, PNG, and HEIC formats supported, max 20MB"
  },
  {
    icon: <SelectIcon />,
    title: "Select Fabric Area",
    description: "Use our intuitive drag tool to precisely select the fabric area you want to measure. The more accurate your selection, the better the results.",
    extendedDescription: "Click and drag to create a boundary around your fabric. Use the corner handles to refine your selection. Double-click to auto-detect fabric edges using our AI algorithm. You can also use the 'Magic Wand' tool for fabrics with distinct patterns or colors.",
    tooltip: "Supports rectangular, polygonal, and freehand selections"
  },
  {
    icon: <RulerIcon />,
    title: "Set Measurement Scale",
    description: "Include a reference object (like a ruler or coin) in your image to set the measurement scale accurately.",
    extendedDescription: "Draw a line along your reference object of known length (e.g., a 6-inch ruler or 1-inch button). Enter the exact measurement when prompted. Our system will use this scale to calculate precise measurements. For best results, place the reference object on the same plane as your fabric.",
    tooltip: "Supports inches, centimeters, and millimeters"
  },
  {
    icon: <ChartIcon />,
    title: "Get Results",
    description: "Our advanced algorithm processes your image to provide detailed measurements of your selected fabric area with high precision.",
    extendedDescription: "View real-time measurements of area, width, height, and perimeter. Save results in multiple formats including PDF reports with detailed specs. Import into your preferred design software with our export options. You can also calculate material requirements based on your measurements.",
    tooltip: "99.7% accuracy for properly calibrated images"
  }
];

function Instructions() {
  const observerRef = useRef(null);
  const elementsRef = useRef([]);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    // Auto rotate through steps every 5 seconds if not in interactive mode
    const interval = setInterval(() => {
      if (!Object.keys(expandedSteps).length && !demoActive) {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [expandedSteps, demoActive]);

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

  // Handle measuring process
  const handleStartMeasuring = () => {
    setLoading(true);
    // Simulate processing, replace with actual functionality
    setTimeout(() => {
      setLoading(false);
      // You could navigate to another page or show a success message here
    }, 2000);
  };

  // Toggle expanded content for a step
  const toggleExpanded = (index) => {
    setExpandedSteps({
      ...expandedSteps,
      [index]: !expandedSteps[index]
    });
  };

  // Determine if a step should be highlighted based on activeStep
  const isHighlighted = (index, originalHighlight) => {
    if (demoActive) {
      return index === activeStep;
    }
    return originalHighlight;
  };

  return (
    <div className="instructions-container">
      <div className="section-subtitle animate-on-scroll">HOW IT WORKS</div>
      <h1 className="main-title animate-on-scroll">Accurate Fabric Measurement</h1>
      
      <div className="sub-heading animate-on-scroll">
        Transform your fabric measuring experience with our easy-to-use digital tool.
        Our advanced technology ensures precise measurements every time, saving you time and reducing material waste.
      </div>
      
      {/* Progress tracker */}
      <div className="progress-tracker stagger-animation">
        {steps.map((_, index) => (
          <div 
            key={index} 
            className={`progress-dot ${index === activeStep ? 'active' : ''}`}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step-card stagger-animation ${isHighlighted(index, step.highlight) ? 'highlight' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onMouseEnter={() => setActiveTooltip(index)}
            onMouseLeave={() => setActiveTooltip(null)}
            onClick={() => !expandedSteps[index] && toggleExpanded(index)}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleExpanded(index)}
          >
            <div className="step-icon">
              {step.icon}
            </div>
            <div className="step-title">{step.title}</div>
            <div className="step-description">{step.description}</div>
            
            {/* Expanded content when "Read More" is clicked */}
            {expandedSteps[index] && (
              <div className="expanded-content">
                {step.extendedDescription}
              </div>
            )}
            
            {/* Tooltip on hover */}
            {activeTooltip === index && step.tooltip && (
              <div className="step-tooltip">
                {step.tooltip}
              </div>
            )}
            
            <div 
              className="read-more" 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(index);
              }}
              onKeyPress={(e) => e.key === 'Enter' && toggleExpanded(index)}
              tabIndex={0}
            >
              {expandedSteps[index] ? "SHOW LESS" : "READ MORE"}
            </div>
          </div>
        ))}
      </div>
      
      {/* Button group with loading state */}
      <div className="button-group">
        <button 
          className="measure-btn stagger-animation"
          onClick={handleStartMeasuring}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : "Start Measuring"}
        </button>
        
        <button 
          className="demo-btn stagger-animation"
          onClick={() => setDemoActive(!demoActive)}
        >
          {demoActive ? "Exit Demo" : "Try Demo"}
        </button>
      </div>
      
      {/* Demo mode instructions - show only when demo is active */}
      {demoActive && (
        <div className="demo-instructions stagger-animation" style={{ marginTop: '30px', color: '#3b82f6' }}>
          <p>Demo Mode Active: Click through the steps above to see the measurement process</p>
        </div>
      )}
    </div>
  );
}

export default Instructions;