import React, { useState } from 'react';

function VulnerabilitiesTable({ vulnerabilities, onViewDetails }) {
  const [sortField, setSortField] = useState('cvss');
  const [sortDirection, setSortDirection] = useState('desc');
  const [search, setSearch] = useState('');

  const sortedVulns = [...vulnerabilities]
    .filter(v => v.title.toLowerCase().includes(search.toLowerCase()) || v.cve.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "cvss") { aValue = parseFloat(aValue); bValue = parseFloat(bValue); }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <input
        placeholder="Search vulnerabilities"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom:8}}
      />
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th onClick={() => { setSortField("cve");setSortDirection(d=>d==="asc"?"desc":"asc"); }}>CVE</th>
            <th>Title</th>
            {/* <th onClick={() => { setSortField("vendor");setSortDirection(d=>d==="asc"?"desc":"asc"); }}>Vendor</th> */}
            <th>Severity</th>
            <th onClick={() => { setSortField("cvss");setSortDirection(d=>d==="asc"?"desc":"asc"); }}>CVSS</th>
            <th>Status</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedVulns.map(vuln =>
            <tr key={vuln.id}>
              <td>{vuln.cve}</td>
              <td>{vuln.title.slice(0,40)}{vuln.title.length>40?'...':""}</td>
              {/* <td>{vuln.vendor}</td> */}
              <td>{vuln.severity}</td>
              <td>{vuln.cvss}</td>
              <td>{vuln.status}</td>
              <td>{new Date(vuln.published).toLocaleDateString()}</td>
              <td><button onClick={() => onViewDetails(vuln)}>View</button></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VulnerabilitiesTable;
