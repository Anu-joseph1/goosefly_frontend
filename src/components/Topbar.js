import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Topbar.css";
import gooseLogo from "../assets/goose.jpeg";
import { FaSearch, FaArrowLeft, FaCog, FaBars, FaBell } from "react-icons/fa";

const TopBar = ({ toggleMenu, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
        // Default TopBar Design with Authentication
        <>
          <FaBars className="icon hamburger-menu" onClick={toggleMenu} />
          <div className="logo-container">
            <img src={gooseLogo} alt="Goose Logo" className="logo-img" />
            <div className="logo-text">Goosefly</div>
          </div>
          <div className="icons-container">
            <FaSearch className="icon search-icon" />
            <FaBell className="icon notification-icon" />
            {currentUser && (
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;