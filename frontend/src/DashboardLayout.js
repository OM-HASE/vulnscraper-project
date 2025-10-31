import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout({ onLogout }) {
  const location = useLocation();
  let page = "Dashboard";
  if (location.pathname.includes("settings")) page = "Settings";
  else if (location.pathname.includes("reports")) page = "Reports";
  else if (location.pathname.includes("vulnerabilities")) page = "Vulnerabilities";
  // Add similar logic for other pages if needed

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div className="main-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header pageName={page} onLogout={onLogout} />
        <main style={{ flexGrow: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
