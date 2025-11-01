import axios from "axios";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// --- Configuration ---
const MONGO_URI = "mongodb+srv://admin:8Ijp0rInygD29tRi@vulnscraper.qijcpij.mongodb.net/?appName=vulnscraper";
const DB_NAME = "test";
const COLLECTION_NAME = "vulnerabilities";
const NVD_API_KEY = "8048515c-25fb-4a14-9f3a-ee37e1cff765";
const BASE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const RESULTS_PER_PAGE = 500; // Max 200 per NVD docs
const MAX_PAGES = 100; // You can increase this later for more data
const SLEEP_MS = 500; // To respect API rate limits

// --- Helper to wait ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Function to normalize data into desired MongoDB format ---
function normalizeVulnerability(item) {
  const cve = item.id || "Unknown";
  const descriptions = item.descriptions || [];
  const englishDesc =
    descriptions.find((d) => d.lang === "en")?.value ||
    "No description available";

  const title = englishDesc.substring(0, 120) + "...";

  // Severity and CVSS
  let severity = "Unknown";
  let cvss = 0;
  if (item.metrics) {
    const v3 = item.metrics.cvssMetricV31 || item.metrics.cvssMetricV30;
    const v2 = item.metrics.cvssMetricV2;

    if (v3 && v3.length > 0) {
      severity = v3[0].cvssData.baseSeverity || "Unknown";
      cvss = v3[0].cvssData.baseScore || 0;
    } else if (v2 && v2.length > 0) {
      severity = v2[0].baseSeverity || "Unknown";
      cvss = v2[0].cvssData?.baseScore || 0;
    }
  }

  // References
  const refs =
    item.references?.map((r) => r.url).filter(Boolean) ||
    item.cve?.references?.map((r) => r.url) ||
    [];

  // Published / Updated dates
  const published = item.published
    ? new Date(item.published)
    : new Date();
  const updated = item.lastModified
    ? new Date(item.lastModified)
    : new Date();

  return {
    cve,
    title,
    description: englishDesc,
    severity,
    cvss,
    published,
    updated,
    createdAt: published,
    references: refs,
    tags: ["NVD"],
    status: "Analyzed",
  };
}

// --- Fetch NVD data ---
async function fetchVulnerabilities(startIndex = 0) {
  const now = new Date();
  const pubEndDate = now.toISOString().split("T")[0] + "T00:00:00.000";
  const pubStartDate =
    new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0] + "T00:00:00.000";

  const headers = {
    "User-Agent": "nvd-mongo-sample/1.0 (sample@example.com)",
  };
  if (NVD_API_KEY) headers["apiKey"] = NVD_API_KEY;

  const params = {
    startIndex,
    resultsPerPage: RESULTS_PER_PAGE,
    pubStartDate: pubStartDate,
    pubEndDate: pubEndDate,
  };

  const res = await axios.get(BASE_URL, { headers, params });
  return res.data.vulnerabilities || [];
}

// --- Main Function ---
async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  console.log("Connected to MongoDB.");

  let totalUpserted = 0;
  const allCurrentCVEs = new Set();

  for (let page = 0; page < MAX_PAGES; page++) {
    const startIndex = page * RESULTS_PER_PAGE;
    console.log(`Fetching CVEs starting from index ${startIndex}...`);

    const vulns = await fetchVulnerabilities(startIndex);

    if (!vulns.length) {
      console.log("No more data.");
      break;
    }

    // Track all CVEs from current fetch to later delete obsolete ones if desired
    vulns.forEach((v) => {
      if (v.cve && v.cve.id) allCurrentCVEs.add(v.cve.id);
    });

    // Prepare bulk operations for upsert to insert or update accordingly
    const bulkOps = vulns.map((v) => {
      const doc = normalizeVulnerability(v.cve);
      return {
        updateOne: {
          filter: { cve: doc.cve },
          update: { $set: doc },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(bulkOps, { ordered: false });

    totalUpserted += (result.upsertedCount || 0) + (result.modifiedCount || 0);

    console.log(
      `Upserted ${
        (result.upsertedCount || 0) + (result.modifiedCount || 0)
      } records (Total so far: ${totalUpserted}).`
    );

    if (page < MAX_PAGES - 1) {
      console.log(`Sleeping ${SLEEP_MS / 1000}s to respect rate limits...`);
      await sleep(SLEEP_MS);
    }
  }

  // Optional clean-up: Delete vulnerabilities that are not in current fetch
  // Uncomment below block if you want to remove outdated entries
  /*
  const currentCVEsArray = Array.from(allCurrentCVEs);
  const deleteResult = await collection.deleteMany({ cve: { $nin: currentCVEsArray } });
  console.log(`Deleted ${deleteResult.deletedCount} outdated records.`);
  */

  console.log(`✅ Done. Total upserted: ${totalUpserted}`);
  await client.close();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
