const express = require('express');
const router = express.Router();
const cron = require('node-cron');

const Scheduler = require('../models/Scheduler');

const { sleep, normalizeVulnerability, fetchVulnerabilities } = require('../utils/scrapper');

const RESULTS_PER_PAGE = 500;
const MAX_PAGES = 1000;
const SLEEP_MS = 500;

let scheduledCron = null;

const run = async (cron) => {
    if(cron.status === "running") {
        console.log("Scraper is already running. Skipping this run.");
        return;
    }
    cron.status = "running";
    await cron.save();
    await scrapper();
    cron.status = "completed";
    cron.completedAt = new Date();
    await cron.save();
};

async function scrapper() {

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

    vulns.forEach((v) => {
      if (v.cve && v.cve.id) allCurrentCVEs.add(v.cve.id);
    });

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

    const result = await Scheduler.bulkWrite(bulkOps, { ordered: false });

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

  console.log(`Done. Total upserted: ${totalUpserted}`);
}

router.get('/', async (req, res) => {
  try {
    const schedulers = await Scheduler.find();
    res.json(schedulers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { cron: cronExpression } = req.body;
    let existing = await Scheduler.findOne({ type: "scraper" });
    if (existing) {
      existing.cron = cronExpression;
      existing = await existing.save();
    }
    if (scheduledCron) {
        scheduledCron.stop()
        scheduledCron = cron.schedule(cronExpression, () => {
            run(existing);
        });
    };
    res.json(existing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to restart cron job' });
  }
});

async function insertDefaultCron() {
    const existing = await Scheduler.findOne({ type: "scraper" });
    if (!existing) {
        const defaultCron = new Scheduler({
          type: "scraper",
          status: "stopped",
          cron: "*/5 * * * *",
          completedAt: new Date(),
        });
        await defaultCron.save();
    }
}

async function startScraper() {
    const existing = await Scheduler.findOne({ type: "scraper" });
    if (existing) {
        scheduledCron = cron.schedule(existing.cron, () => {
            run(existing);
        });
    } else {
        console.error("No cron schedule found for scraper.");
    }
}

insertDefaultCron();
startScraper();
module.exports = router;