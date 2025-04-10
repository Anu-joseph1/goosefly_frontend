import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/page4';
import Login from './components/Login';
import awsExports from './awsExports';
Amplify.Logger.LOG_LEVEL = 'DEBUG';

// Configure Amplify
Amplify.configure(awsExports);

// Configure Auth module to use USER_PASSWORD_AUTH flow
Auth.configure({
  authenticationFlowType: 'USER_PASSWORD_AUTH'
});

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user.username);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuthState();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Router>
      <AppContent 
        isOpen={isOpen} 
        toggleMenu={toggleMenu} 
        isAuthenticated={!!currentUser} 
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAuthenticating={isAuthenticating}
      />
    </Router>
  );
}

function AppContent({ isOpen, toggleMenu, isAuthenticated, currentUser, onLogin, onLogout, isAuthenticating }) {
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

  if (isAuthenticating) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      {shouldShowTopBar && (
        <TopBar 
          toggleMenu={toggleMenu} 
          currentUser={currentUser} 
          onLogout={onLogout} 
        />
      )}
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