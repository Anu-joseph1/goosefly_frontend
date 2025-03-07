import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCog, FaPlus, FaBug, FaLightbulb } from "react-icons/fa"; // Import icons
import "./ReportTopBar.css"; // Import CSS

const ReportTopBar = () => {
  const navigate = useNavigate(); // For back navigation
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  const handlePlusClick = () => {
    setShowPopup(!showPopup); // Toggle popup visibility
  };

  return (
    <div className="report-topbar">
      <FaArrowLeft className="icon left-icon" onClick={() => navigate(-1)} />
      <h2 className="title">REPORTS - INTERNAL</h2>
      <div className="right-icons">
        <FaPlus className="icon plus-icon" onClick={handlePlusClick} />
        <FaCog className="icon right-icon" />
      </div>

      {/* Popup Box */}
      {showPopup && (
        <div className="popup-box">
          <div
            className="popup-item"
            onClick={() => alert("Create a new issue")}
          >
            <FaBug className="popup-icon" />
            <span>Create a new issue</span>
          </div>
          <div
            className="popup-item"
            onClick={() => alert("Add a suggestion")}
          >
            <FaLightbulb className="popup-icon" />
            <span>Add a suggestion</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTopBar;