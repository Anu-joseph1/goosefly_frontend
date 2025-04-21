import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideNav.css';

const SideNav = ({ isOpen, toggleMenu }) => {
  const location = useLocation();

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <div className="sidenav-content" onClick={(e) => e.stopPropagation()}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={toggleMenu}>Home</Link>
        <Link to="/report" className={location.pathname === '/report' ? 'active' : ''} onClick={toggleMenu}>Report</Link>
        <Link to="/organization" className={location.pathname === '/organization' ? 'active' : ''} onClick={toggleMenu}>Organization</Link>
        {/* <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={toggleMenu}>Profile</Link> */}
        <Link to="/organization" className={location.pathname === '/organization' ? 'active' : ''} onClick={toggleMenu}>My Profile</Link>
      </div>
    </div>
  );
};

export default SideNav;