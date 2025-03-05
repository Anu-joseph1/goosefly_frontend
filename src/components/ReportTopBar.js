import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCog } from "react-icons/fa"; // Import icons
import "./ReportTopBar.css"; // Import CSS

const ReportTopBar = () => {
  const navigate = useNavigate(); // For back navigation

  return (
    <div className="report-topbar">
      <FaArrowLeft className="icon left-icon" onClick={() => navigate(-1)} />
      <h2 className="title">REPORTS - INTERNAL</h2>
      <FaCog className="icon right-icon" />
    </div>
  );
};

export default ReportTopBar;