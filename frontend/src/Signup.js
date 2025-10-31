import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage(data.error || "Signup failed.");
    }
  };

  // DEMO: Replace with actual Google OAuth logic if you add Google signup
  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setMessage("Signed up with Google (demo)");
      setTimeout(() => navigate("/dashboard"), 1100);
    }, 1800);
  };

  return (
    <>
      <style>{`
        body {
          background-color: #f5f7fa;
        }
        .signup-page-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
        }
        .signup-card {
          background: #fff;
          box-shadow: 0 8px 36px #61dafb22;
          border-radius: 16px;
          padding: 2.8rem 2.2rem;
          width: 370px;
          max-width: 97vw;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .signup-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        .signup-logo-icon {
          font-size: 1.8rem;  /* Match dashboard/header/sidebar */
          color: #61dafb;
          margin-right: 0.55rem;
        }
        .app-name {
          font-size: 1.39rem;
          font-weight: 700;
          color: #282c34;
          letter-spacing: 1px;
        }
        .form-title {
          font-size: 1.33rem;
          font-weight: 700;
          color: #282c34;
          margin-bottom: 0.9rem;
        }
        .signup-form {
          width: 100%;
        }
        .signup-form input {
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
        .signup-form input:focus {
          border-color: #61dafb;
          outline: none;
        }
        .signup-btn {
          width: 100%;
          background: #61dafb;
          color: #282c34;
          font-weight: 700;
          border: none;
          border-radius: 7px;
          padding: 0.66rem 0;
          font-size: 1.07rem;
          cursor: pointer;
          margin-top: 0.18rem;
          box-shadow: 0 3px 10px #61dafb33;
          transition: background 0.22s, color 0.22s;
        }
        .signup-btn:hover {
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
          margin: 0.6rem 0 0.1rem 0;
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
        .signup-message {
          margin: 8px 0 0 0;
          font-weight: 600;
          color: #38bc59;
          letter-spacing: 0.1px;
        }
        .signup-message:empty {
          display: none;
        }
        .signup-login-link {
          margin-top: 0.9rem;
          text-align: center;
          color: #282c34;
          font-size: 1rem;
        }
        .signup-link-btn {
          background: none;
          border: none;
          color: #61dafb;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.2s;
          margin-left: 4px;
        }
        .signup-link-btn:hover {
          color: #21a1f1;
        }
      `}</style>

      <div className="signup-page-container">
        <div className="signup-card">
          <div className="signup-header">
            <i className="fas fa-shield-virus signup-logo-icon"></i>
            <span className="app-name">VulnScraper</span>
          </div>
          <h2 className="form-title">Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="signup-btn">
              Sign up
            </button>
          </form>
          <button
            className="google-btn"
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
          >
            <i className="fab fa-google google-btn-icon"></i>
            {googleLoading ? "Processing..." : "Sign up with Google"}
          </button>
          {message && <div className="signup-message">{message}</div>}
          <div className="signup-login-link">
            Already have an account?
            <button
              className="signup-link-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
