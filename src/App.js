import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import { Hub } from '@aws-amplify/core';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/page4';
import Page5 from './pages/page5';
import ChatPage from './components/ChatPage';

// Updated Amplify configuration
Amplify.configure({
  ...awsExports,
  Auth: {
    region: awsExports.aws_cognito_region,
    userPoolId: awsExports.aws_user_pools_id,
    userPoolWebClientId: awsExports.aws_user_pools_web_client_id,
    authenticationFlowType: 'USER_SRP_AUTH' // Recommended flow
  }
});

function App() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChanged, setAuthChanged] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);

      const session = await fetchAuthSession();
      const authToken = session.tokens?.idToken?.toString();
      if (authToken) {
        console.log('Token fetched:', authToken);
        localStorage.setItem('authToken', authToken);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const authListener = ({ payload }) => {
      if (payload.event === 'signIn') {
        console.log('User signed in');
        fetchUser();
        setAuthChanged((prev) => !prev);
      } else if (payload.event === 'signOut') {
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        setAuthChanged((prev) => !prev);
      }
    };

    const unsubscribe = Hub.listen('auth', authListener);
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Authenticator hideSignUp={true}>
      {({ signOut }) => (
        <Router>
          <AppContent 
            isOpen={isOpen} 
            toggleMenu={toggleMenu} 
            isAuthenticated={isAuthenticated} 
            currentUser={user}
            onLogout={signOut}
            authChanged={authChanged}
          />
        </Router>
      )}
    </Authenticator>
  );
}

function AppContent({ isOpen, toggleMenu, isAuthenticated, currentUser, onLogout, authChanged }) {
  const location = useLocation();

  const shouldShowTopBar = 
    location.pathname !== "/report" && 
    location.pathname !== "/organization" && 
    !location.pathname.startsWith("/profile/") &&
    location.pathname !== "/my-profile" &&
    !location.pathname.startsWith("/chat/");

  const shouldShowSideNav = 
    location.pathname !== "/report" && 
    location.pathname !== "/organization" &&
    location.pathname !== "/my-profile" &&
    !location.pathname.startsWith("/chat/");

  return (
    <div className="App">
      {shouldShowTopBar && <TopBar toggleMenu={toggleMenu} currentUser={currentUser} onLogout={onLogout} />}
      {shouldShowSideNav && <SideNav isOpen={isOpen} toggleMenu={toggleMenu} currentUser={currentUser} />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Page1 isOpen={isOpen} />} />
          <Route path="/report" element={<Page2 />} />
          <Route path="/organization" element={<Page3 />} />
          <Route path="/profile/:employeeId" element={<Page4 />} />
          <Route path="/my-profile" element={<Page5 currentUser={currentUser} />} />
          <Route path="/chat/:employeeId" element={<ChatPage currentUser={currentUser} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;