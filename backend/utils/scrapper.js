import axios from "axios";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const NVD_API_KEY = "8048515c-25fb-4a14-9f3a-ee37e1cff765";
const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const RESULTS_PER_PAGE = 5;

export function sleep (ms) { return new Promise((resolve) => setTimeout(resolve, ms)); };

// --- Estimate CVSS from severity label ---
export function estimateCvssFromSeverity(severity) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return 9.5;
    case "HIGH":
      return 8.0;
    case "MEDIUM":
      return 5.0;
    case "Low":
      return 2.5;
    default:
      return 0;
  }
}

// --- Normalize vulnerability data ---
export function normalizeVulnerability(item) {
  const cve = item.id || "Unknown";
  const descriptions = item.descriptions || [];
  const englishDesc =
    descriptions.find((d) => d.lang === "en")?.value || "No description available";

  const title = englishDesc.substring(0, 120) + "...";

  // Extract severity and CVSS
  let severity = "Unknown";
  let cvss = null;

  if (item.metrics) {
    const v3 = item.metrics.cvssMetricV31 || item.metrics.cvssMetricV30;
    const v2 = item.metrics.cvssMetricV2;

    if (v3 && v3.length > 0) {
      severity = v3[0].cvssData.baseSeverity || "Unknown";
      cvss = v3[0].cvssData.baseScore;
    } else if (v2 && v2.length > 0) {
      severity = v2[0].baseSeverity || "Unknown";
      cvss = v2[0].cvssData?.baseScore;
    }
  }

  // --- Normalize CVSS and Severity ---
  if (typeof cvss === "string" && cvss.toUpperCase() === "N/A") {
    cvss = null;
  }
  if (isNaN(Number(cvss))) {
    cvss = null;
  }

  // If CVSS missing, estimate from severity
  if (!cvss || cvss === 0) {
    cvss = estimateCvssFromSeverity(severity);
  }

  // If severity unknown, derive it from CVSS
  if (severity === "Unknown" || severity === "N/A") {
    if (cvss >= 9.0) severity = "Critical";
    else if (cvss >= 7.0) severity = "High";
    else if (cvss >= 4.0) severity = "Medium";
    else severity = "Low";
  }

  // If both missing or invalid, assign random CVSS (1–6) and set severity
  if ((!cvss || cvss === 0) && (severity === "Unknown" || severity === "N/A")) {
    cvss = Math.random() * 5 + 1; // random between 1.0 and 6.0
    if (cvss >= 4.0) severity = "Medium";
    else severity = "Low";
  }

  // --- Determine status dynamically ---
  let status = "Active";
  const desc = englishDesc.toLowerCase();

  if (desc.includes("awaiting analysis")) {
    status = "Awaiting Analysis";
  } else if (
    desc.includes("mitigated") ||
    desc.includes("resolved") ||
    desc.includes("fixed")
  ) {
    status = "Mitigated";
  } else if (
    desc.includes("under investigation") ||
    desc.includes("investigating")
  ) {
    status = "Under Investigation";
  } else if (desc.includes("rejected") || desc.includes("not applicable")) {
    status = "Rejected";
  } else if (
    desc.includes("deprecated") ||
    desc.includes("retired") ||
    desc.includes("obsolete")
  ) {
    status = "Deprecated";
  }

  // References
  const refs =
    item.references?.map((r) => r.url).filter(Boolean) ||
    item.cve?.references?.map((r) => r.url) ||
    [];

  // Published / Updated dates
  const published = item.published ? new Date(item.published) : new Date();
  const updated = item.lastModified ? new Date(item.lastModified) : new Date();

  return {
    cve,
    title,
    description: englishDesc,
    severity,
    cvss: Number(cvss.toFixed(1)), // rounded to 1 decimal place
    published,
    updated,
    createdAt: published,
    references: refs,
    tags: ["NVD"],
    status,
  };
}

// --- Fetch NVD data ---
export async function fetchVulnerabilities(startIndex = 0) {
  const now = new Date();
  const pubEndDate = now.toISOString().split("T")[0] + "T00:00:00.000";
  const pubStartDate =
    new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0] + "T00:00:00.000";

  const headers = {
    "User-Agent": "vulnscraper/1.0 (sample@example.com)",
  };
  if (NVD_API_KEY) headers["apiKey"] = NVD_API_KEY;

  const params = {
    startIndex,
    resultsPerPage: RESULTS_PER_PAGE,
    pubStartDate,
    pubEndDate,
  };

  const res = await axios.get(BASE_URL, { headers, params });
  return res.data.vulnerabilities || [];
}