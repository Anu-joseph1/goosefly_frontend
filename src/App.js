import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/page4';
import Login from './components/Login';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <AppContent 
        isOpen={isOpen} 
        toggleMenu={toggleMenu} 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

function AppContent({ isOpen, toggleMenu, isAuthenticated, currentUser, onLogin, onLogout }) {
  const location = useLocation();

  const shouldShowTopBar = 
    location.pathname !== "/report" && 
    location.pathname !== "/organization" && 
    !location.pathname.startsWith("/profile/") &&
    location.pathname !== "/login";

  const shouldShowSideNav = 
    location.pathname !== "/report" && 
    location.pathname !== "/organization" &&
    location.pathname !== "/login";

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      {shouldShowTopBar && <TopBar toggleMenu={toggleMenu} currentUser={currentUser} onLogout={onLogout} />}
      {shouldShowSideNav && <SideNav isOpen={isOpen} toggleMenu={toggleMenu} />}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/" element={<Page1 isOpen={isOpen} />} />
          <Route path="/report" element={<Page2 />} />
          <Route path="/organization" element={<Page3 />} />
          <Route path="/profile/:employeeId" element={<Page4 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;