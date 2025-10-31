import React from 'react';
import Sidebar from './Sidebar';
// eslint-disable-next-line no-unused-vars
import Header from './Header'; // optional if it's part of layout
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        {/* You could add <Header /> here if you want it for all pages */}
        <Outlet />
      </div>
    </div>
  );
}
