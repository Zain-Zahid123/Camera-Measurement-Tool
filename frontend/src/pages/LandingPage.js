// LandingPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Instruction from "../components/Instruction"; // ✅ Updated import
import "../components/Instruction.css"; // ✅ Updated import

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/select-method");
  };

  return (
    <div className="page-container">
      {/* We're reusing the existing Instruction component for the landing page */}
      <Instruction />

      {/* Add a "Get Started" button that navigates to method selection */}
    </div>
  );
}

export default LandingPage;
