export const vulnerabilityData = {
  vulnerabilities: [
    {
      id: "1",
      cve: "CVE-2024-1234",
      title: "Cisco IOS XE Web UI Privilege Escalation Vulnerability",
      description: "A vulnerability in the web-based management interface of Cisco IOS XE software could allow an authenticated, remote attacker to perform a privilege escalation attack.",
      severity: "Critical",
      cvss: 9.8,
      vendor: "Cisco",
      product: "IOS XE",
      version: "17.6.x",
      status: "Active",
      published: "2024-10-05T08:00:00Z",
      references: ["https://sec.cisco.com/advisory/1234"],
      impact: {
        confidentiality: "Complete",
        integrity: "Complete", 
        availability: "Complete"
      }
    },
    {
      id: "2",
      cve: "CVE-2024-5678",
      title: "Juniper Networks Junos OS Command Injection",
      description: "A command injection vulnerability in Juniper Networks Junos OS allows remote code execution.",
      severity: "High",
      cvss: 8.1,
      vendor: "Juniper",
      product: "Junos OS",
      version: "22.4R1",
      status: "Under Investigation",
      published: "2024-10-03T14:30:00Z",
      references: ["https://kb.juniper.net/advisory/5678"]
    },
    {
      id: "3",
      cve: "CVE-2024-9012",
      title: "Honeywell Experion PKS Buffer Overflow",
      description: "A buffer overflow vulnerability in Honeywell Experion PKS could lead to denial of service.",
      severity: "Medium",
      cvss: 5.3,
      vendor: "Honeywell",
      product: "Experion PKS",
      version: "C200.2",
      status: "Resolved",
      published: "2024-09-28T10:15:00Z",
      references: ["https://process.honeywell.com/security/9012"]
    },
    {
      id: "4",
      cve: "CVE-2024-3456",
      title: "Microsoft Windows Kernel Information Disclosure",
      description: "An information disclosure vulnerability exists in the Windows kernel that could allow elevation of privilege.",
      severity: "High",
      cvss: 7.8,
      vendor: "Microsoft",
      product: "Windows",
      version: "11 22H2",
      status: "Active",
      published: "2024-10-01T16:45:00Z",
      references: ["https://msrc.microsoft.com/update-guide/3456"]
    },
    {
      id: "5",
      cve: "CVE-2024-7890",
      title: "VMware vCenter Server Authentication Bypass",
      description: "An authentication bypass vulnerability in VMware vCenter Server could allow remote attackers to gain administrative access.",
      severity: "Critical",
      cvss: 9.1,
      vendor: "VMware",
      product: "vCenter Server",
      version: "7.0 U3",
      status: "Active", 
      published: "2024-09-25T12:20:00Z",
      references: ["https://www.vmware.com/security/advisories/7890"]
    }
  ],
  statistics: {
    total: 5,
    critical: 2,
    high: 2,
    medium: 1,
    low: 0,
    active: 3,
    resolved: 1,
    investigating: 1
  },
  trends: [
    {date: "2024-09-25", count: 1},
    {date: "2024-09-28", count: 1}, 
    {date: "2024-10-01", count: 1},
    {date: "2024-10-03", count: 1},
    {date: "2024-10-05", count: 1}
  ],
  alerts: [
    {
      id: "alert1",
      message: "New Critical vulnerability detected: Cisco IOS XE Web UI Privilege Escalation",
      severity: "critical",
      timestamp: "2024-10-05T08:00:00Z"
    }
  ]
};
