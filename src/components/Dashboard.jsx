import React, { useState } from 'react';
//import Sidebar from "./Sidebar";
import TopNavbar from './TopNavbar';
import CardsSection from './CardsSection';

import '../assets/css/dashboard.css'; // optional css for layout

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dashboard dark-mode' : 'dashboard'}>
      <div className="main-content">
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="content-wrapper p-4">
          <CardsSection darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
