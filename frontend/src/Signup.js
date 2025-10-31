import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage("Please enter your email to send OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpSent(true);
        setMessage("OTP sent! Please check your email.");
      } else {
        setMessage(data.error || "Failed to send OTP.");
      }
    } catch {
      setMessage("Error sending OTP. Try again.");
    }
    setLoading(false);
  };

  // Verify OTP input
  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP you received.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpVerified(true);
        setMessage("OTP verified successfully! Please set your password.");
      } else {
        setMessage(data.error || "OTP verification failed.");
      }
    } catch {
      setMessage("Error verifying OTP. Try again.");
    }
    setLoading(false);
  };

  // Final submit for signup after OTP verified
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage("Please verify OTP before signing up.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch {
      setMessage("Error signing up. Try again.");
    }
    setLoading(false);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google User:', decoded);

    fetch('http://localhost:5000/api/auth/google-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('Signed up with Google!');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setMessage(data.error || 'Google signup failed.');
        }
      })
      .catch(() => setMessage('Google signup failed.'));
  };

  const handleGoogleError = () => {
    setMessage('Google login failed. Try again.');
  };

  return (
    <>
      <style>{`
        body {
          background-color: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .signup-page-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
          padding: 1rem;
        }
        .signup-card {
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
        .signup-card:hover {
          box-shadow: 0 15px 60px rgba(97, 218, 251, 0.25);
        }
        .signup-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .signup-logo-icon {
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
        .signup-form {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .signup-form input {
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
        .signup-form input::placeholder {
          color: #a2aabf;
          font-weight: 500;
        }
        .signup-form input:focus {
          border-color: #61dafb;
          outline: none;
          box-shadow: 0 0 6px 2px rgba(97, 218, 251, 0.4);
        }
        .signup-btn {
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
        .signup-btn:hover:enabled {
          background: #21a1f1;
          color: #fff;
          box-shadow: 0 6px 22px rgba(33, 161, 241, 0.7);
        }
        .signup-btn:disabled {
          background: #a6d9fb;
          cursor: not-allowed;
        }
        .signup-message {
          margin: 12px 0 0 0;
          font-weight: 700;
          color: #38bc59;
          letter-spacing: 0.1px;
          font-size: 0.94rem;
          text-align: center;
          min-height: 1.2rem;
          user-select: none;
        }
        .signup-login-link {
          margin-top: 1.1rem;
          text-align: center;
          color: #282c34;
          font-size: 1rem;
          letter-spacing: 0.3px;
          font-weight: 600;
        }
        .signup-link-btn {
          background: none;
          border: none;
          color: #61dafb;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.25s ease;
          margin-left: 6px;
          padding: 0;
          letter-spacing: 0.7px;
          user-select: none;
        }
        .signup-link-btn:hover {
          color: #21a1f1;
        }
        /* Google Login button container adjustments */
        .google-login-button {
          width: 100%;
          margin: 1.1rem 0 0 0;
          display: flex;
          justify-content: center;
        }
      `}</style>

      <div className="signup-page-container">
        <div className="signup-card" role="main" aria-label="Signup form">
          <div className="signup-header">
            <i className="fas fa-shield-virus signup-logo-icon" aria-hidden="true"></i>
            <span className="app-name">VulnScraper</span>
          </div>
          <h2 className="form-title">Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              aria-label="Full Name"
              disabled={otpSent}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-label="Email Address"
              disabled={otpSent}
            />

            {!otpSent && (
              <button
                type="button"
                className="signup-btn"
                onClick={handleSendOTP}
                disabled={loading || !formData.email || !formData.name}
                aria-label="Send OTP"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {otpSent && !otpVerified && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  aria-label="OTP input"
                  maxLength={6}
                  style={{ marginBottom: "1rem" }}
                />
                <button
                  type="button"
                  className="signup-btn"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  aria-label="Verify OTP"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {otpVerified && (
              <>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  aria-label="Password"
                  minLength={6}
                  title="Password must be at least 6 characters"
                />
                <button
                  type="submit"
                  className="signup-btn"
                  disabled={loading || !formData.password}
                  aria-label="Sign up"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </>
            )}
          </form>

          <div className="google-login-button" aria-label="Sign up with Google">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleGoogleError} 
            />
          </div>

          <div role="alert" className="signup-message" aria-live="polite">
            {message}
          </div>

          <div className="signup-login-link">
            Already have an account?
            <button
              className="signup-link-btn"
              type="button"
              onClick={() => navigate("/login")}
              aria-label="Navigate to Sign in page"
            >
              login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
