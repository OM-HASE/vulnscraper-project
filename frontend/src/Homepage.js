import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-shield-virus login-logo-icon"></i>
        <span className="app-name">VulnScraper</span>
      </div>
      <nav className="nav">
        <Link to="/login" className="btn login-btn">Login</Link>
        <Link to="/signup" className="btn signup-btn">Sign Up</Link>
      </nav>
    </header>
  );
};

const Homepage = () => {
  return (
    <div>
      <Header />

      <main className="main-content">
        <section className="hero">
          <h1>VulnScraper: OEM Vulnerability Detection System</h1>
          <p>
            A comprehensive MERN stack application with Go-based web scrapers
            for real-time OEM vulnerability detection and automated reporting.
          </p>
        </section>

        <section className="features info-section">
          <h2>Features</h2>
          <ul>
            <li>
              <b>Real-time Vulnerability Scraping</b>: Go-based scrapers for Cisco,
              Juniper, Honeywell, and other OEM security advisories
            </li>
            <li>
              <b>Machine Learning Classification</b>: Automated severity assessment and risk scoring
            </li>
            <li>
              <b>Interactive Dashboard</b>: React-based dashboard with real-time updates and data visualization
            </li>
            <li>
              <b>Real-time Alerts</b>: Socket.IO and Twilio integration for immediate notifications
            </li>
            <li><b>RESTful API</b>: Comprehensive API for external integrations</li>
            <li><b>Containerized Deployment</b>: Docker support for easy deployment and scaling</li>
          </ul>
        </section>

        <section className="architecture info-section">
          <h2>Architecture</h2>
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
            {`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Go Scrapers   │───▶│   MongoDB       │◀───│  Express API    │
│   (Data Source) │    │   (Database)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                          │
                                          ▼
                                  ┌─────────────────┐
                                  │  React Dashboard│
                                  │   (Frontend)    │
                                  └─────────────────┘
              `}
          </pre>
        </section>

        <section className="techstack info-section">
          <h2>Tech Stack</h2>
          <ul>
            <li><b>Scraper</b>: Go (Golang) with Colly framework</li>
            <li><b>Backend</b>: Node.js + Express.js</li>
            <li><b>Frontend</b>: React.js with Material-UI</li>
            <li><b>Database</b>: MongoDB</li>
            <li><b>Real-time</b>: Socket.IO</li>
            <li><b>Alerts</b>: Twilio SMS, Email notifications</li>
            <li><b>Charts</b>: Chart.js / Recharts</li>
            <li><b>Deployment</b>: Docker + Docker Compose</li>
          </ul>
        </section>

        <section className="about info-section">
          <h2>About the Creators</h2>
          <p>
            VulnScraper was developed by a passionate computer science student focused on web security and full-stack development using Go and the MERN stack.
          </p>
        </section>

        <section className="support info-section">
          <h2>Support & Contact</h2>
          <p>Email: <a href="mailto:omhase777@gmail.com">omhase777@gmail.com</a></p>
          <p>
            Report issues or contribute on {" "}
            <a href="https://github.com/your-username/vulnscraper/issues" target="_blank" rel="noopener noreferrer">
              GitHub Issues
            </a>
          </p>
          <p>
            Full documentation and project wiki available on GitHub.
          </p>
        </section>

        <section className="disclaimer info-section">
          <h2>Security Notice</h2>
          <p>
            This tool is for legitimate security monitoring purposes only. Ensure compliance with applicable laws and website terms of service when scraping external sites.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
