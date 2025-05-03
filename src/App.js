import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/page4';
import Page5 from './pages/page5';
import ChatPage from './components/ChatPage'; // Add this import
import Login from './components/Login';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
    location.pathname !== "/login" &&
    location.pathname !== "/my-profile" &&
    !location.pathname.startsWith("/chat/"); // Add chat path exclusion

  const shouldShowSideNav = 
    location.pathname !== "/report" && 
    location.pathname !== "/organization" &&
    location.pathname !== "/login" &&
    location.pathname !== "/my-profile" &&
    !location.pathname.startsWith("/chat/"); // Add chat path exclusion

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      {shouldShowTopBar && <TopBar toggleMenu={toggleMenu} currentUser={currentUser} onLogout={onLogout} />}
      {shouldShowSideNav && <SideNav isOpen={isOpen} toggleMenu={toggleMenu} currentUser={currentUser} />}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/" element={<Page1 isOpen={isOpen} />} />
          <Route path="/report" element={<Page2 />} />
          <Route path="/organization" element={<Page3 />} />
          <Route path="/profile/:employeeId" element={<Page4 />} />
          <Route path="/my-profile" element={<Page5 currentUser={currentUser} />} />
          <Route path="/chat/:employeeId" element={<ChatPage currentUser={currentUser} />} /> {/* Add this route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;