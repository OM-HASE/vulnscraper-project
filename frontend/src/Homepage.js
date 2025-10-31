import React from "react";
import { Link } from 'react-router-dom';

const Header = () => (
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <i className="fas fa-shield-virus" style={styles.logoIcon}></i>
      <span style={styles.appName}>VulnScraper</span>
    </div>
    <nav>
      <Link
        to="/login"
        style={styles.btn}
        onMouseEnter={e => e.target.style.background = "#e4f0fb"}
        onMouseLeave={e => e.target.style.background = "transparent"}
      >
        Login
      </Link>
      <Link
        to="/signup"
        style={styles.signupBtn}
        onMouseEnter={e => e.target.style.background = "#21a1f1"}
        onMouseLeave={e => e.target.style.background = "#61dafb"}
      >
        Sign Up
      </Link>
    </nav>
  </header>
);

const FeatureCard = ({ title, desc }) => (
  <div
    style={styles.featureCard}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 18px #61dafb33")}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = styles.featureCard.boxShadow)}
  >
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
          <Link
            to="/signup"
            style={styles.primaryButton}
            onMouseEnter={e => (e.target.style.background = "#21a1f1")}
            onMouseLeave={e => (e.target.style.background = "#61dafb")}
          >
            Get Started
          </Link>
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
            <a href="mailto:omhase777@gmail.com" style={styles.link}>omhase777@gmail.com</a> or visit our{" "}
            <a href="https://github.com/OM-HASE/vulnscraper-project/issues" target="_blank" rel="noopener noreferrer" style={styles.link}>
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
    color: "#282c34",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh"
  },
  header: {
    backgroundColor: "#282c34",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 3rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px #61dafb22"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center"
  },
  logoIcon: {
    fontSize: "1.8rem",
    color: "#61dafb",
    marginRight: "0.5rem"
  },
  appName: {
    fontSize: "1.5rem",
    fontWeight: "700"
  },
  btn: {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "1rem",
    color: "#61dafb",
    border: "2px solid #61dafb",
    backgroundColor: "transparent",
    transition: "background 0.3s",
    display: "inline-block",
  },
  signupBtn: {
    color: "#fff",
    backgroundColor: "#61dafb",
    border: "2px solid #61dafb",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "1rem",
    transition: "background 0.3s",
    display: "inline-block",
  },
  mainContent: {
    maxWidth: "1080px",
    margin: "3rem auto",
    padding: "0 1rem"
  },
  heroSection: {
    textAlign: "center",
    padding: "4rem 1rem 3rem 1rem",
    backgroundColor: "#e4f0fb",
    borderRadius: "14px",
    boxShadow: "0 2px 15px #61dafb22",
    marginBottom: "4rem",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#282c34",
    letterSpacing: "1px"
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#426991",
    maxWidth: "540px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.5",
  },
  primaryButton: {
    backgroundColor: "#61dafb",
    color: "#282c34",
    padding: "0.7rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "6px",
    textDecoration: "none",
    boxShadow: "0 5px 15px #61dafb55",
    transition: "background 0.3s",
    display: "inline-block",
    border: "2px solid #61dafb",
  },
  featuresSection: {
    marginTop: "3.5rem"
  },
  sectionTitle: {
    fontSize: "2rem",
    borderBottom: "3px solid #61dafb",
    display: "inline-block",
    paddingBottom: "0.23rem",
    marginBottom: "2rem",
    fontWeight: "700",
    color: "#282c34"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "2.2rem",
  },
  featureCard: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 16px #61dafb11",
    padding: "2rem 1.3rem 1.5rem",
    borderRadius: "10px",
    transition: "box-shadow 0.2s",
    cursor: "default",
    minHeight: "170px",
  },
  featureTitle: {
    fontSize: "1.15rem",
    color: "#2778ac",
    fontWeight: "700",
    marginBottom: "0.6rem"
  },
  featureDesc: {
    fontSize: "1rem",
    color: "#282c34",
    lineHeight: "1.55",
  },
  aboutSection: {
    marginTop: "5rem",
    backgroundColor: "#e4f0fb",
    padding: "2.3rem",
    borderRadius: "10px"
  },
  aboutText: {
    fontSize: "1.07rem",
    maxWidth: "700px",
    margin: "0 auto",
    color: "#2778ac",
    fontWeight: "500",
    lineHeight: "1.55"
  },
  contactSection: {
    marginTop: "4rem",
    textAlign: "center",
    color: "#282c34",
    fontSize: "1.07rem",
    marginBottom: "3rem"
  },
  link: {
    color: "#61dafb",
    textDecoration: "underline",
    fontWeight: "bold"
  },
  footer: {
    marginTop: "4rem",
    padding: "1.2rem",
    fontSize: "0.93rem",
    textAlign: "center",
    color: "#888",
    borderTop: "1px solid #dde5ef",
    background: "#f5f7fa"
  }
};

export default Homepage;
