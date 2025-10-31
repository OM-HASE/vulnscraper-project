import React, { useEffect, useState } from "react";
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

// Unified Contributors Section: combines static + GitHub contributors
const Contributors = () => {
  

  const [gitHubContributors, setGitHubContributors] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/repos/OM-HASE/vulnscraper-project/contributors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // map GitHub contributors into consistent format
          const ghContribs = data.map(user => ({
            id: user.id,
            name: user.login,
            role: null,
            photo: user.avatar_url,
            profileUrl: user.html_url,
            contributions: user.contributions,
          }));
          setGitHubContributors(ghContribs);
        }
      })
      .catch(err => console.error("Failed to fetch contributors", err));
  }, []);

  // Merge static team + GitHub contributors
  // Avoid duplicating if someone's in both sets by name or id
  // Here just concatenate for simplicity
  const allContributors = [...gitHubContributors];

  return (
    <section style={styles.contributorsSection}>
      <h2 style={styles.sectionTitle}>Contributors</h2>
      <div style={styles.contributorsGrid}>
        {allContributors.map(member => (
          <div key={member.id} style={styles.contributorCard}>
            {member.profileUrl ? (
              <a href={member.profileUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <img src={member.photo} alt={member.name} style={styles.contributorPhoto} />
                <h4 style={styles.contributorName}>{member.name}</h4>
                <p style={styles.contributorRole}>
                  {member.role ? member.role : ""}
                  {member.contributions ? ` - ${member.contributions} contributions` : ""}
                </p>
              </a>
            ) : (
              <>
                <img src={member.photo} alt={member.name} style={styles.contributorPhoto} />
                <h4 style={styles.contributorName}>{member.name}</h4>
                <p style={styles.contributorRole}>{member.role}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const Homepage = () => {
  return (
    <div style={styles.pageContainer}>
      <Header />

      <main style={styles.mainContent}>
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>VulnScraper</h1>
          <p style={styles.heroSubtitle}>
            Automated, Real-Time OEM Vulnerability Detection & Reporting
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
              title="Faster & Scalable"
              desc="Built with Go's concurrency, ensures rapid data collection from multiple OEMs."
            />
            <FeatureCard
              title="Rule-Based Classification"
              desc="Avoids heavy ML dependencies; classifies vulnerabilities based on logic and severity."
            />
            <FeatureCard
              title="Real-Time Reporting"
              desc="Instant alerts via dashboard, email, and SMS, keeping teams proactive."
            />
            <FeatureCard
              title="Open Source & Transparent"
              desc="Community-driven, secure, and customizable for enterprise needs."
            />
            <FeatureCard
              title="Domain-Specific Focus"
              desc="Specialized in industrial ITOT infrastructures to secure critical systems."
            />
            <FeatureCard
              title="Easy Deployment"
              desc="Dockerized setup, scalable in enterprise environments."
            />
          </div>
        </section>

        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>About the Creators</h2>
          <p style={styles.aboutText}>
            VulnScraper is an open-source security tool created by a dedicated team of cybersecurity experts and full-stack developers passionate about industrial and enterprise cybersecurity. Built in Go for speed and concurrency, it automates OEM vulnerability monitoring, enabling organizations to strengthen defenses proactively.
          </p>
        </section>

        {/* Unified Contributors Section */}
        <Contributors />

        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>How VulnScraper Works</h2>
          <ul style={styles.howItWorksList}>
            <li><strong>Automated Scraping:</strong> Concurrently collect vulnerability advisories from Cisco, Juniper, Honeywell, and more using optimized Go-based scrapers.</li>
            <li><strong>Data Processing:</strong> Clean, standardize, and categorize data with rule-based classifiers assessing severity levels (Critical, High, Medium, Low).</li>
            <li><strong>Reporting & Alerts:</strong> Visualize insights via dashboard, with real-time notifications via email and SMS (Twilio, Socket.IO).</li>
            <li><strong>Continuous Integration:</strong> Dockerized, easy updates, and adaptable to website changes ensuring ongoing effectiveness.</li>
          </ul>
        </section>

        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>Technology Stack</h2>
          <table style={styles.techTable}>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Technology</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data Collection</td>
                <td>Golang</td>
                <td>High-speed, concurrent web scraping from multiple OEM sources</td>
              </tr>
              <tr>
                <td>Backend API</td>
                <td>Node.js with Express</td>
                <td>RESTful APIs for data access and management</td>
              </tr>
              <tr>
                <td>Frontend UI</td>
                <td>React.js</td>
                <td>Interactive dashboards with real-time updates</td>
              </tr>
              <tr>
                <td>Database</td>
                <td>MongoDB</td>
                <td>Flexible NoSQL storage for vulnerabilities and advisories</td>
              </tr>
              <tr>
                <td>Notification System</td>
                <td>Twilio, Socket.IO</td>
                <td>Email/SMS alerts and verified real-time notifications</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={styles.aboutSection}>
          <h2 style={styles.sectionTitle}>Key Benefits</h2>
          <ul style={styles.benefitsList}>
            <li><strong>Speed & Scalability:</strong> Built with Go's concurrency for rapid, scalable data scraping across multiple OEM sites.</li>
            <li><strong>Logic-Driven Classification:</strong> Avoid heavy ML, using rule-based severity ranking based on the data scraped.</li>
            <li><strong>Real-Time Alerts:</strong> Instant notifications via dashboard, email, and SMS to enable proactive security management.</li>
            <li><strong>Open Source Collaboration:</strong> Community-driven development with ongoing improvements.</li>
            <li><strong>Domain Specific:</strong> Focus on industrial OT/IT systems for targeted protection of critical infrastructure.</li>
            <li><strong>Deployment Ease:</strong> Dockerized setup for flexible deployment across enterprise environments.</li>
          </ul>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.sectionTitle}>Join Our Security Community</h2>
          <p style={styles.ctaText}>
            Contribute, review, or customize VulnScraper's open-source code on our <a href="https://github.com/OM-HASE/vulnscraper-project" target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub repository</a>. Help us improve industrial cybersecurity together.
          </p>
        </section>

        <section style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Stay Connected</h2>
          <p>
            Have questions or want to contribute? Reach out at{" "}
            <a href="mailto:omhase777@gmail.com" style={styles.link}>omhase777@gmail.com</a> or visit our{" "}
            <a href="https://github.com/OM-HASE/vulnscraper-project/issues" target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub Issues</a>.
          </p>
        </section>

        <footer style={styles.footer}>
          <p>
            ⚠️ This tool is for legitimate security monitoring purposes only. Always respect legal and OEM policies when scraping data.
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
    minHeight: "100vh",
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
    boxShadow: "0 2px 8px #61dafb22",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: "1.8rem",
    color: "#61dafb",
    marginRight: "0.5rem",
  },
  appName: {
    fontSize: "1.5rem",
    fontWeight: "700",
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
    padding: "0 1rem",
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
    letterSpacing: "1px",
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
    marginTop: "3.5rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    borderBottom: "3px solid #61dafb",
    display: "inline-block",
    paddingBottom: "0.23rem",
    marginBottom: "2rem",
    fontWeight: "700",
    color: "#282c34",
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
    cursor: "pointer",
    minHeight: "170px",
  },
  featureTitle: {
    fontSize: "1.15rem",
    color: "#2778ac",
    fontWeight: "700",
    marginBottom: "0.6rem",
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
    borderRadius: "10px",
  },
  aboutText: {
    fontSize: "1.07rem",
    maxWidth: "700px",
    margin: "0 auto",
    color: "#2778ac",
    fontWeight: "500",
    lineHeight: "1.55",
  },
  benefitsList: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
  },
  howItWorksList: {
    listStyleType: "circle",
    paddingLeft: "1.5rem",
  },
  ctaSection: {
    marginTop: "4rem",
    backgroundColor: "#f1f9fe",
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center",
  },
  ctaText: {
    fontSize: "1.2rem",
  },
  link: {
    color: "#61dafb",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  contactSection: {
    marginTop: "4rem",
    textAlign: "center",
    color: "#282c34",
    fontSize: "1.07rem",
    marginBottom: "3rem",
  },
  footer: {
    marginTop: "4rem",
    padding: "1.2rem",
    fontSize: "0.93rem",
    textAlign: "center",
    color: "#888",
    borderTop: "1px solid #dde5ef",
    background: "#f5f7fa",
  },
  techTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  contributorsSection: {
    marginTop: "5rem",
    backgroundColor: "#e4f0fb",
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center",
  },
  contributorsGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  contributorCard: {
    width: "150px",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px #61dafb22",
    textAlign: "center",
    cursor: "pointer",
  },
  contributorPhoto: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "0.7rem",
    objectFit: "cover",
  },
  contributorName: {
    fontWeight: "700",
    fontSize: "1rem",
    marginBottom: "0.3rem",
    color: "#2778ac",
  },
  contributorRole: {
    fontSize: "0.9rem",
    color: "#426991",
  },
};

export default Homepage;
