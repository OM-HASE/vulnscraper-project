import React, { useState, useEffect } from "react";
import axios from "axios";
import VulnerabilityModal from "./VulnerabilityModal";

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVuln, setSelectedVuln] = useState(null);

  useEffect(() => {
    fetchVulnerabilities();
  }, []);

  const fetchVulnerabilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/vulnerabilities');
      setVulnerabilities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vulnerabilities');
      console.error('Error fetching vulnerabilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(search.toLowerCase()) ||
                         vuln.cve.toLowerCase().includes(search.toLowerCase()) ||
                         (vuln.description && vuln.description.toLowerCase().includes(search.toLowerCase()));
    const matchesSeverity = !severityFilter || vuln.severity === severityFilter;
    const matchesVendor = !vendorFilter || vuln.vendor === vendorFilter;
    const matchesStatus = !statusFilter || vuln.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesVendor && matchesStatus;
  });

  const handleViewDetails = (vuln) => {
    setSelectedVuln(vuln);
  };

  const handleCloseModal = () => {
    setSelectedVuln(null);
  };

  if (loading) return <div>Loading vulnerabilities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <h1 className="page-title">Vulnerabilities</h1>
        </div>
        <div className="header-right">
          <div className="current-time">{new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
          <div className="user-profile">
            <i className="fas fa-user-circle"></i>
            <span>Admin</span>
          </div>
        </div>
      </header>

      <div className="filters-section">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by CVE, title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-row">
          <select
            className="form-control"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            className="form-control"
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <option value="">All Vendors</option>
            <option value="Cisco">Cisco</option>
            <option value="Microsoft">Microsoft</option>
            <option value="VMware">VMware</option>
            <option value="Juniper">Juniper</option>
            <option value="Honeywell">Honeywell</option>
          </select>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button className="btn btn--secondary">
            <i className="fas fa-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      <div className="vulnerabilities-table-container">
        <div className="card">
          <div className="card__body">
            <div className="table-container">
              <table className="vulnerabilities-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
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
                  {filteredVulnerabilities.map(vuln => (
                    <tr key={vuln._id}>
                      <td><input type="checkbox" /></td>
                      <td>{vuln.cve}</td>
                      <td>{vuln.title}</td>
                      <td>{vuln.vendor || 'N/A'}</td>
                      <td>{vuln.severity || 'N/A'}</td>
                      <td>{vuln.cvss || 'N/A'}</td>
                      <td>{vuln.status}</td>
                      <td>{vuln.published ? new Date(vuln.published).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleViewDetails(vuln)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer">
                <div className="table-info">
                  Showing <span>{filteredVulnerabilities.length}</span> vulnerabilities
                </div>
                <div className="pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedVuln && (
        <VulnerabilityModal vuln={selectedVuln} onClose={handleCloseModal} />
      )}
    </div>
  );
}
