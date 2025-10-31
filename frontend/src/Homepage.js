import React from "react";
import { Link } from 'react-router-dom';

const Header = () => (
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <i className="fas fa-shield-virus" style={styles.logoIcon}></i>
      <span style={styles.appName}>VulnScraper</span>
    </div>
    <nav>
      <Link to="/login" style={{ ...styles.btn, ...styles.loginBtn }}>Login</Link>
      <Link to="/signup" style={{ ...styles.btn, ...styles.signupBtn }}>Sign Up</Link>
    </nav>
  </header>
);

const FeatureCard = ({ title, desc }) => (
  <div style={styles.featureCard}>
    <h3 style={styles.featureTitle}>{title}</h3>
    <p style={styles.featureDesc}>{desc}</p>
  </div>
);

const Homepage = () => {
  return (
    <div style={styles.pageContainer}>
      <Header />

      <main style={styles.mainContent}>
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>VulnScraper</h1>
          <p style={styles.heroSubtitle}>
            Real-time OEM Vulnerability Detection with Automated Reporting
          </p>
          <Link to="/signup" style={styles.primaryButton}>Get Started</Link>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Why Choose VulnScraper?</h2>
          <div style={styles.featuresGrid}>
            <FeatureCard
              title="Real-time Vulnerability Scraping"
              desc="Continuous security data collection from Cisco, Juniper, Honeywell, and more."
            />
            <FeatureCard
              title="Machine Learning Classification"
              desc="Automatic severity assessment and risk scoring for actionable insights."
            />
            <FeatureCard
              title="Interactive Dashboard"
              desc="Powerful React-based interface with live charts and customizable views."
            />
            <FeatureCard
              title="Instant Alerts"
              desc="Receive SMS and email notifications for critical vulnerabilities immediately."
            />
            <FeatureCard 
              title="Comprehensive API"
              desc="Integrate VulnScraper data with your tooling through RESTful API access."
            />
            <FeatureCard 
              title="Scalable Deployment"
              desc="Dockerized for easy setup and deployment in enterprise environments."
            />
          </div>
        </section>

        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>About the Creators</h2>
          <p style={styles.aboutText}>
            Built by a dedicated computer science student passionate about cybersecurity and full-stack development using Go and the MERN stack. VulnScraper aims to empower organizations with timely, accurate vulnerability data.
          </p>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Stay Connected</h2>
          <p>
            Have questions or want to contribute? Reach out at{" "}
            <a href="mailto:omhase777@gmail.com" style={styles.link}>omhase777@gmail.com</a> or visit our {" "}
            <a href="https://github.com/your-username/vulnscraper/issues" target="_blank" rel="noopener noreferrer" style={styles.link}>
              GitHub Issues
            </a>.
          </p>
        </section>

        <footer style={styles.footer}>
          <p>
            ⚠️ This tool is for legitimate security monitoring purposes only. Always comply with laws and site policies when scraping.
          </p>
        </footer>
      </main>
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#1c1c1c",
    backgroundColor: "#fefefe",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#24292f",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 3rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center"
  },
  logoIcon: {
    fontSize: "1.8rem",
    color: "#28a745",
    marginRight: "0.5rem"
  },
  appName: {
    fontSize: "1.5rem",
    fontWeight: "700"
  },
  nav: {},
  btn: {
    padding: "0.5rem 1.25rem",
    borderRadius: "4px",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "1rem",
    transition: "background-color 0.3s ease",
    display: "inline-block",
  },
  loginBtn: {
    color: "#28a745",
    border: "2px solid #28a745",
    backgroundColor: "transparent",
  },
  signupBtn: {
    color: "#fff",
    backgroundColor: "#28a745",
    border: "2px solid #28a745",
  },

  mainContent: {
    maxWidth: "1024px",
    margin: "3rem auto",
    padding: "0 1rem"
  },
  heroSection: {
    textAlign: "center",
    padding: "4rem 1rem",
    backgroundColor: "#e9f5ec",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgb(40 167 69 / 0.2)",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#19692c"
  },
  heroSubtitle: {
    fontSize: "1.3rem",
    marginBottom: "2rem",
    color: "#3a6043",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  primaryButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "6px",
    textDecoration: "none",
    boxShadow: "0 5px 15px #237a26",
    transition: "background-color 0.3s ease",
  },
  primaryButtonHover: {
    backgroundColor: "#1c541a"
  },

  featuresSection: {
    marginTop: "5rem"
  },
  sectionTitle: {
    fontSize: "2rem",
    borderBottom: "3px solid #28a745",
    display: "inline-block",
    paddingBottom: "0.25rem",
    marginBottom: "2rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "2rem"
  },
  featureCard: {
    backgroundColor: "white",
    boxShadow: "0 2px 14px rgb(0 0 0 / 0.05)",
    padding: "2rem",
    borderRadius: "8px",
    transition: "transform 0.2s ease",
    cursor: "default",
  },
  featureTitle: {
    fontSize: "1.3rem",
    color: "#19692c",
    marginBottom: "0.75rem",
    fontWeight: "700"
  },
  featureDesc: {
    fontSize: "1rem",
    color: "#3a3a3a",
  },

  aboutSection: {
    marginTop: "6rem",
    backgroundColor: "#f4fdf6",
    padding: "2.5rem",
    borderRadius: "8px"
  },
  aboutText: {
    fontSize: "1.1rem",
    maxWidth: "700px",
    margin: "0 auto",
    color: "#2d2d2d",
  },

  contactSection: {
    marginTop: "4rem",
    textAlign: "center",
    color: "#555",
    fontSize: "1.05rem",
  },
  
  link: {
    color: "#28a745",
    textDecoration: "underline",
  },

  footer: {
    marginTop: "6rem",
    padding: "1.5rem",
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#888",
    borderTop: "1px solid #ddd",
  }
};

export default Homepage;
