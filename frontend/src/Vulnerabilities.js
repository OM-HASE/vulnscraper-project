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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #121418; /* dark background */
          color: #cbd3da;           /* dark text */
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme, body.light-theme html {
          background-color: #f5f7fa; /* light background */
          color: #282c34;            /* light text */
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #282c34;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme .header {
          background: #ffffff;
          color: #282c34;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 600;
        }

        .current-time {
          font-weight: 500;
          font-size: 0.9rem;
          margin-right: 1.5rem;
          color: #9da5b4;
          transition: color 0.4s ease;
        }

        body.light-theme .current-time {
          color: #666666;
        }

        .user-profile {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
          transition: color 0.4s ease;
        }

        body.light-theme .user-profile {
          color: #444444;
        }

        .user-profile i {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          color: #61dafb;
          transition: color 0.4s ease;
        }

        body.light-theme .user-profile i {
          color: #007acc;
        }

        .filters-section {
          max-width: 1200px;
          margin: 1.5rem auto;
          padding: 0 1rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: #282c34;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          max-width: 500px;
          margin-bottom: 1rem;
          border: 1.5px solid #444;
          transition: background-color 0.4s ease, border-color 0.3s ease;
        }

        body.light-theme .search-bar {
          background: #fff;
          border: 1.5px solid #ddd;
        }

        .search-bar i {
          color: #61dafb;
          font-size: 1.1rem;
          margin-right: 0.5rem;
          transition: color 0.4s ease;
        }

        body.light-theme .search-bar i {
          color: #007acc;
        }

        .search-bar input {
          border: none;
          outline: none;
          flex-grow: 1;
          font-size: 1rem;
          padding: 0.35rem 0;
          background: transparent;
          color: #cbd3da;
          transition: color 0.4s ease;
        }

        body.light-theme .search-bar input {
          color: #282c34;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-control {
          padding: 8px 12px;
          border: 1.5px solid #444;
          border-radius: 6px;
          font-size: 1rem;
          min-width: 150px;
          transition: border-color 0.3s ease, background-color 0.4s ease, color 0.4s ease;
          background-color: #282c34;
          color: #cbd3da;
          cursor: pointer;
        }

        body.light-theme .form-control {
          border: 1.5px solid #ddd;
          background-color: #fff;
          color: #282c34;
        }

        .form-control:focus {
          outline: none;
          border-color: #61dafb;
          box-shadow: 0 0 6px rgba(97, 218, 251, 0.5);
        }

        .btn {
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          user-select: none;
          background-color: #6c757d;
          color: white;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #545b62;
        }

        .vulnerabilities-table-container {
          max-width: 1200px;
          margin: 0 auto 2rem auto;
          padding: 0 1rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .card {
          background: #1e222a;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          padding: 1rem;
          overflow-x: auto;
          transition: background-color 0.4s ease;
        }

        body.light-theme .card {
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .card__body {
          padding: 0;
        }

        .table-container {
          width: 100%;
          min-width: 900px;
          overflow-x: auto;
        }

        table.vulnerabilities-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          min-width: 900px;
        }

        table.vulnerabilities-table th,
        table.vulnerabilities-table td {
          padding: 0.8rem 0.7rem;
          border-bottom: 1px solid #444;
          color: #cbd3da;
          text-align: left;
          vertical-align: middle;
          white-space: nowrap;
          transition: color 0.4s ease, border-color 0.4s ease;
        }

        body.light-theme table.vulnerabilities-table th,
        body.light-theme table.vulnerabilities-table td {
          color: #282c34;
          border-bottom: 1px solid #ddd;
        }

        table.vulnerabilities-table th {
          background-color: #22262f;
          font-weight: 700;
          user-select: none;
          transition: background-color 0.4s ease, color 0.4s ease;
        }

        body.light-theme table.vulnerabilities-table th {
          background-color: #e4f0fb;
          color: #282c34;
        }

        table.vulnerabilities-table tbody tr:hover {
          background-color: #3a3f4b;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        body.light-theme table.vulnerabilities-table tbody tr:hover {
          background-color: #d0e8ff;
        }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #61dafb;
          font-size: 1.2rem;
          padding: 0.25rem 0.5rem;
          transition: color 0.3s ease;
        }

        .action-btn:hover {
          color: #21a1f1;
        }

        .table-footer {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #999;
          transition: color 0.4s ease;
        }

        body.light-theme .table-footer {
          color: #555;
        }

        .table-info span {
          font-weight: 700;
          color: #61dafb;
          transition: color 0.4s ease;
        }

        body.light-theme .table-info span {
          color: #282c34;
        }
      `}</style>

      <div>

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
                      <th>
                        <input type="checkbox" />
                      </th>
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
                    {filteredVulnerabilities.map((vuln) => (
                      <tr key={vuln._id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{vuln.cve}</td>
                        <td>{vuln.title}</td>
                        <td>{vuln.vendor || "N/A"}</td>
                        <td>{vuln.severity || "N/A"}</td>
                        <td>{vuln.cvss || "N/A"}</td>
                        <td>{vuln.status}</td>
                        <td>
                          {vuln.published
                            ? new Date(vuln.published).toLocaleDateString()
                            : "N/A"}
                        </td>
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
    </>
  );
}
