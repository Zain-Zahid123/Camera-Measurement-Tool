import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import LandingPage from "./pages/LandingPage";
import MethodSelectionPage from "./pages/MethodSelectionPage";
import UploadMeasurementPage from "./pages/UploadMeasurementPage";
import ManualMeasure from "./pages/ManualMeasure";
import ARMeasurementPage from "./pages/ARMeasurementPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";

// Import global styles
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route redirects to landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Method selection page */}
          <Route path="/select-method" element={<MethodSelectionPage />} />
          
          {/* Measurement pages based on method selection */}
          <Route path="/measure/upload" element={<UploadMeasurementPage />} />
          <Route path="/measure/manual" element={<ManualMeasure />} />
          <Route path="/measure/ar" element={<ARMeasurementPage />} />
          
          {/* Results and history pages */}
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;