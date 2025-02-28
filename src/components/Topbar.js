import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topbar.css"; // Ensure correct import
import gooseLogo from "../assets/goose.jpeg"; // Use relative path
import { FaSearch, FaArrowLeft, FaCog } from "react-icons/fa"; // Import icons

const TopBar = () => {
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For back navigation

  // Check if we are on the Organization page
  const isOrganizationPage = location.pathname === "/organization";

  return (
    <div className="topbar">
      {isOrganizationPage ? (
        // Organization TopBar Design
        <>
          <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
          <h2 className="title">COMPANY PROFILE</h2>
          <FaCog className="icon" />
        </>
      ) : (
        // Default TopBar Design
        <>
          <div className="logo-container">
            <img src={gooseLogo} alt="Goose Logo" className="logo-img" />
            <div className="logo-text">Goosefly</div>
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" className="search-input" placeholder="Search..." />
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;
