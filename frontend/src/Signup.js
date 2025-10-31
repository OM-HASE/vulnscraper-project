import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css"; // Ensure this is imported

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
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

  return (
    <div className="signup-page-container">
      <div className="signup-card">
        {/* Logo & App Name */}
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
  );
};

export default Signup;
