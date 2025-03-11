import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topbar.css"; // Ensure correct import
import gooseLogo from "../assets/goose.jpeg"; // Use relative path
import { FaSearch, FaArrowLeft, FaCog, FaBars, FaBell } from "react-icons/fa"; // Import icons

const TopBar = ({ toggleMenu }) => {
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
          <FaBars className="icon hamburger-menu" onClick={toggleMenu} /> {/* Hamburger menu */}
          <div className="logo-container">
            <img src={gooseLogo} alt="Goose Logo" className="logo-img" />
            <div className="logo-text">Goosefly</div>
          </div>
          <div className="icons-container">
            <FaSearch className="icon search-icon" />
            <FaBell className="icon notification-icon" />
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;
