import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import DashboardLayout from './DashboardLayout';
import Settings from './Settings';
import Vulnerabilities from './Vulnerabilities';
import Reports from './Reports';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    const syncLogout = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes wrapped by DashboardLayout */}
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard onLogout={handleLogout} />} />
        <Route path="dashboard" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vulnerabilities" element={<Vulnerabilities />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
