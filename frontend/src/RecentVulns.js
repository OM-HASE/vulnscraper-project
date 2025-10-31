import React, { useState, useEffect } from "react";
import axios from "axios";
import VulnerabilityModal from "./VulnerabilityModal";

export default function RecentVulns() {
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVuln, setSelectedVuln] = useState(null);

  useEffect(() => {
    fetchRecentVulns();
  }, []);

  const fetchRecentVulns = async () => {
    try {
      const response = await axios.get('/api/vulnerabilities/recent');
      setVulns(response.data);
    } catch (error) {
      console.error('Error fetching recent vulnerabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vuln) => {
    setSelectedVuln(vuln);
  };

  const handleCloseModal = () => {
    setSelectedVuln(null);
  };

  const pillClass = (value) => ["pill", value.toLowerCase().replace(' ', '-')].join(' ');

  if (loading) {
    return (
      <div className="recent-vulnerabilities">
        <div className="card">
          <div className="card__header"><h3>Recent Vulnerabilities</h3></div>
          <div className="card__body">Loading recent vulnerabilities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-vulnerabilities">
      <div className="card">
        <div className="card__header"><h3>Recent Vulnerabilities</h3></div>
        <div className="card__body">
          <div className="table-container">
            <table className="vulnerabilities-table">
              <thead>
                <tr>
                  <th>CVE</th>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>Severity</th>
                  <th>CVSS</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vulns.map(v => (
                  <tr key={v._id}>
                    <td>{v.cve}</td>
                    <td>{v.title}</td>
                    <td>{v.vendor || 'N/A'}</td>
                    <td><span className={pillClass(v.severity)}>{v.severity}</span></td>
                    <td><b>{v.cvss || 'N/A'}</b></td>
                    <td><span className={pillClass(v.status)}>{v.status}</span></td>
                    <td>{v.published ? new Date(v.published).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleViewDetails(v)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedVuln && (
        <VulnerabilityModal vuln={selectedVuln} onClose={handleCloseModal} />
      )}
    </div>
  );
}
