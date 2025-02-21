import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <div className="hamburger-menu" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </div>
      <div className="sidenav-content" onClick={(e) => e.stopPropagation()}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/report" className={location.pathname === '/report' ? 'active' : ''}>Report</Link>
        <Link to="/organization" className={location.pathname === '/organization' ? 'active' : ''}>Organization</Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
      </div>
    </div>
  );
};

export default SideNav;
