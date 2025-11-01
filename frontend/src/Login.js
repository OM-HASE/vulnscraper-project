import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
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
        setMessage(data.error || 'Invalid email or password.');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google User:', decoded);
    } catch (e) {
      // ignore
    }

    fetch('http://localhost:5000/api/auth/google-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('Signed in with Google!');
          if (onLogin) onLogin(credentialResponse.credential);
          navigate('/dashboard');
        } else {
          setMessage(data.error || 'Google sign in failed.');
        }
      })
      .catch(() => {
        setMessage('Google sign in failed.');
      });
  };

  const handleGoogleError = () => {
    setMessage('Google sign in failed. Try again.');
  };

  return (
    <>
      <style>{`
        body {
          background-color: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .login-page-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
          padding: 1rem;
        }
        .login-card {
          background: #fff;
          box-shadow: 0 10px 40px rgba(97, 218, 251, 0.15);
          border-radius: 16px;
          padding: 3rem 2.2rem 3rem 2.2rem;
          width: 380px;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s ease;
        }
        .login-card:hover {
          box-shadow: 0 15px 60px rgba(97, 218, 251, 0.25);
        }
        .login-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .login-logo-icon {
          font-size: 2rem;
          color: #61dafb;
          margin-right: 0.7rem;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }
        .app-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #282c34;
          letter-spacing: 1.2px;
          user-select: none;
        }
        .form-title {
          font-size: 1.45rem;
          font-weight: 700;
          color: #282c34;
          margin-bottom: 1.2rem;
          letter-spacing: 0.5px;
        }
        form {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 0.7rem 1.1rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          border: 1.7px solid #ccecfb;
          background: #e4f0fb;
          color: #282c34;
          box-sizing: border-box;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          font-weight: 500;
        }
        input:focus {
          border-color: #61dafb;
          outline: none;
          box-shadow: 0 0 6px 2px rgba(97, 218, 251, 0.4);
        }
        button[type="submit"] {
          width: 100%;
          background: #61dafb;
          color: #282c34;
          font-weight: 800;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 0;
          font-size: 1.12rem;
          cursor: pointer;
          margin-top: 0.36rem;
          box-shadow: 0 4px 14px rgba(97, 218, 251, 0.4);
          letter-spacing: 1.3px;
          transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        button[type="submit"]:hover:enabled {
          background: #21a1f1;
          color: #fff;
          box-shadow: 0 6px 22px rgba(33, 161, 241, 0.7);
        }
        button[type="submit"]:disabled {
          background: #a6d9fb;
          cursor: not-allowed;
        }
        .google-login-button {
          width: 100%;
          margin: 0.1rem 0 0 0;
          display: flex;
          justify-content: center;
        }
        .message-success {
          color: #38bc59;
          font-weight: 600;
          margin-top: 7px;
          text-align: center;
        }
        .message-error {
          color: #e53e3e;
          font-weight: 600;
          margin-top: 7px;
          text-align: center;
        }
        .login-switch-signup {
          margin-top: 1.2rem;
          text-align: center;
          color: #282c34;
          font-size: 1rem;
          letter-spacing: 0.3px;
          font-weight: 600;
        }
        .login-switch-signup button {
          background: none;
          border: none;
          color: #61dafb;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.25s ease;
        }
        .login-switch-signup button:hover {
          color: #21a1f1;
        }
        .divider-or {
          width: 100%;
          display: flex;
          align-items: center;
          margin: 20px 0;
        }
        .divider-or-line {
          flex: 1;
          height: 1px;
          background: #e4f0fb;
        }
        .divider-or-text {
          margin: 0 12px;
          color: #a2aabf;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.2px;
          user-select: none;
        }
      `}</style>

      <div className="login-page-container">
        <div className="login-card" role="main" aria-label="Login form">
          <div className="login-header">
            <i className="fas fa-shield-virus login-logo-icon" aria-hidden="true"></i>
            <span className="app-name">VulnScraper</span>
          </div>
          <h2 className="form-title">Sign in</h2>

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              aria-label="Email"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-label="Password"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="divider-or" aria-hidden="true">
            <div className="divider-or-line"></div>
            <span className="divider-or-text">or</span>
            <div className="divider-or-line"></div>
          </div>

          <div className="google-login-button" aria-label="Sign in with Google">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
            />
          </div>

          {message && (
            <div
              role="alert"
              className={message.toLowerCase().includes('success') ? 'message-success' : 'message-error'}
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div className="login-switch-signup">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/signup')} aria-label="Navigate to signup page">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
