import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
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

  // DEMO: Replace with real Google OAuth logic in actual app
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setMessage("Logged in with Google (demo)");
      if (onLogin) onLogin("dummy-google-token");
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <>
      <style>{`
        body {
          background-color: #f5f7fa;
        }
        .login-page-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
        }
        .login-card {
          background: #fff;
          box-shadow: 0 8px 36px #61dafb22;
          border-radius: 16px;
          padding: 2.8rem 2.2rem;
          width: 370px;
          max-width: 97vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        .login-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .login-logo-icon {
          font-size: 1.8rem; /* exact match sidebar/header */
          color: #61dafb;   /* VulnScraper accent color */
          margin-right: 0.55rem;
        }
        .app-name {
          font-size: 1.39rem;
          font-weight: 700;
          color: #282c34;
          letter-spacing: 1px;
        }
        h2 {
          margin-top: 0;
          font-size: 1.33rem;
          font-weight: 700;
          color: #282c34;
        }
        form {
          width: 100%;
        }
        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 0.62rem 1rem;
          font-size: 1rem;
          margin-bottom: 0.9rem;
          border-radius: 7px;
          border: 1.5px solid #ccecfb;
          background: #e4f0fb;
          color: #282c34;
          transition: border 0.21s;
        }
        input:focus {
          border-color: #61dafb;
          outline: none;
        }
        button[type="submit"] {
          width: 100%;
          background: #61dafb;
          color: #282c34;
          font-weight: 700;
          border: none;
          border-radius: 7px;
          padding: 0.66rem 0;
          font-size: 1.07rem;
          cursor: pointer;
          margin-top: 0.29rem;
          box-shadow: 0 3px 10px #61dafb33;
          transition: background 0.22s, color 0.22s;
        }
        button[type="submit"]:hover {
          background: #21a1f1;
          color: #fff;
        }
        .google-btn {
          width: 100%;
          background: #fff;
          color: #282c34;
          border: 2px solid #61dafb;
          border-radius: 7px;
          padding: 0.66rem 0;
          font-size: 1.07rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin: 0.6rem 0 0.1rem;
          box-shadow: 0 2px 10px #61dafb17;
          transition: background 0.18s, color 0.18s;
        }
        .google-btn:hover {
          background: #e4f0fb;
          color: #0076a6;
        }
        .google-btn-icon {
          font-size: 1.35rem;
        }
        .message-success {
          color: #38bc59;
          font-weight: 600;
          margin-top: 3px;
        }
        .message-error {
          color: #e53e3e;
          font-weight: 600;
          margin-top: 3px;
        }
        .login-switch-signup {
          margin-top: 0.8rem;
          text-align: center;
          color: #282c34;
          font-size: 1rem;
        }
        .login-switch-signup button {
          background: none;
          border: none;
          color: #61dafb;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
        }
        .login-switch-signup button:hover {
          color: #21a1f1;
        }
      `}</style>

      <div className="login-page-container">
        <div className="login-card">
          <div className="login-header">
            <i className="fas fa-shield-virus login-logo-icon"></i>
            <span className="app-name">VulnScraper</span>
          </div>

          <h2>Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button type="submit">Login</button>
          </form>
          <button
            className="google-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <i className="fab fa-google google-btn-icon"></i>
            {googleLoading ? "Authenticating..." : "Sign in with Google"}
          </button>

          {message && (
            <p className={message.includes('success') ? "message-success" : "message-error"}>
              {message}
            </p>
          )}

          <div className="login-switch-signup">
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate('/signup')}>Sign up</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
