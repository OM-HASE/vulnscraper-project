import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Homepage from './Homepage';
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

  // This function will be passed everywhere as onLogout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout onLogout={handleLogout} />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard onLogout={handleLogout} />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vulnerabilities" element={<Vulnerabilities />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Redirect unknown routes to dashboard if logged in else to login */}
      <Route
        path="*"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
