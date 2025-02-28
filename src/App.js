import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TopBar from './components/Topbar';
import SideNav from './components/SideNav';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/page4';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="App">
        <TopBar />
        <SideNav isOpen={isOpen} toggleMenu={toggleMenu} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Page1 isOpen={isOpen} />} />
            <Route path="/report" element={<Page2 />} />
            <Route path="/organization" element={<Page3 />} />
            <Route path="/profile" element={<Page4 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;