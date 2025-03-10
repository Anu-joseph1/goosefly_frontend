import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <AppContent isOpen={isOpen} toggleMenu={toggleMenu} />
    </Router>
  );
}

// Separate component to use useLocation hook
function AppContent({ isOpen, toggleMenu }) {
  const location = useLocation();

  // Conditionally render TopBar based on the route
  const shouldShowTopBar = location.pathname !== "/report" && location.pathname !== "/organization";

  // Conditionally render SideNav based on the route
  const shouldShowSideNav = location.pathname !== "/report" && location.pathname !== "/organization";

  return (
    <div className="App">
      {shouldShowTopBar && <TopBar toggleMenu={toggleMenu} />} {/* Show TopBar only if not on the report or organization page */}
      {shouldShowSideNav && <SideNav isOpen={isOpen} toggleMenu={toggleMenu} />} {/* Show SideNav only if not on the report or organization page */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Page1 isOpen={isOpen} />} />
          <Route path="/report" element={<Page2 />} />
          <Route path="/organization" element={<Page3 />} />
          <Route path="/profile/:employeeId" element={<Page4 />} /> {/* Add route for profile page with employeeId */}
        </Routes>
      </div>
    </div>
  );
}

export default App;