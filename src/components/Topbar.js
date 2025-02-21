import React from 'react';
import './Topbar.css'; // Ensure correct import
import gooseLogo from '../assets/goose.jpeg'; // Use relative path
import { FaSearch } from 'react-icons/fa'; // Import search icon

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="logo-container">
        <img src={gooseLogo} alt="Goose Logo" className="logo-img" />
        <div className="logo-text">Goosefly</div>
      </div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" className="search-input" placeholder="Search..." />
      </div>
    </div>
  );
};

export default TopBar;
