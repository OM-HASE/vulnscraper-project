import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      setMessage('Login successful!');
      if (onLogin) onLogin(data.token);
      navigate('/dashboard');
    } else {
      setMessage(data.error || 'Login failed.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Logo & App Name using Font Awesome icon */}
        <div className="login-header">
          <i className="fas fa-shield-virus login-logo-icon"></i>
          <span className="app-name">VulnScraper</span>
        </div>

        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
        {message && (
          <p className={message.includes('success') ? "message-success" : "message-error"}>
            {message}
          </p>
        )}
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')}>Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
