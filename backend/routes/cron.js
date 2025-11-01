const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const Vulnerability = require('../models/Vulnerability');
const Scheduler = require('../models/Scheduler');
const { sleep, normalizeVulnerability, fetchVulnerabilities } = require('../utils/scrapper');

const RESULTS_PER_PAGE = 500;
const MAX_PAGES = 1000;
const SLEEP_MS = 2000;

let scheduledCron = null;

const run = async (cronDoc) => {
  try {
    if (cronDoc.status === 'running') {
      console.log('Scraper is already running. Skipping this run.');
      return;
    }
    cronDoc.status = 'running';
    await cronDoc.save();

    console.log('Scraper started at', new Date());
    await scrapper();
    cronDoc.status = 'completed';
    cronDoc.completedAt = new Date();
    await cronDoc.save();
    console.log('Scraper completed at', new Date());
  } catch (error) {
    console.error('Error during scraper run:', error);
    if (cronDoc) {
      cronDoc.status = 'error';
      await cronDoc.save();
    }
  }
};

// Main scrapper function with concise logging
async function scrapper() {
  let totalUpserted = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const startIndex = page * RESULTS_PER_PAGE;

    try {
      const vulns = await fetchVulnerabilities(startIndex);

      if (!vulns.length) {
        console.log('No more data.');
        break;
      }

      const bulkOps = vulns
        .map((v) => {
          const doc = normalizeVulnerability(v.cve);
          if (!doc.cve || typeof doc.cve !== 'string' || doc.cve.trim() === '') {
            return null;
          }
          return {
            updateOne: {
              filter: { cve: doc.cve },
              update: { $set: doc },
              upsert: true,
            },
          };
        })
        .filter(Boolean);

      if (bulkOps.length === 0) {
        continue;
      }

      const result = await Vulnerability.bulkWrite(bulkOps, { ordered: false });

      const upsertCount = (result.upsertedCount || 0) + (result.modifiedCount || 0);
      totalUpserted += upsertCount;

      console.log(`Upserted ${upsertCount} records this page (Total so far: ${totalUpserted})`);

      if (page < MAX_PAGES - 1) {
        await sleep(SLEEP_MS);
      }
    } catch (err) {
      console.error(`Error on page ${page + 1}:`, err);
      break;
    }
  }

  console.log(`Done. Total records upserted: ${totalUpserted}`);
}

// Reset any stuck "running" status on startup
async function resetStuckStatus() {
  const stuck = await Scheduler.findOne({ status: 'running', type: 'scraper' });
  if (stuck) {
    stuck.status = 'stopped';
    await stuck.save();
  }
}

// Basic GET to fetch scheduler info
router.get('/', async (req, res) => {
  try {
    const schedulers = await Scheduler.find();
    res.json(schedulers);
  } catch (error) {
    console.error('Error fetching schedulers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Trigger manual run of scraper
// router.post('/run', async (req, res) => {
//   try {
//     let cronDoc = await Scheduler.findOne({ type: 'scraper' });
//     if (!cronDoc) {
//       return res.status(404).json({ error: 'Scraper cron not configured' });
//     }
//     await run(cronDoc);
//     res.json({ message: 'Scraper run triggered' });
//   } catch (error) {
//     console.error('Error running scraper manually:', error);
//     res.status(500).json({ error: 'Failed to run scraper' });
//   }
// });

// Update cron schedule
router.put('/', async (req, res) => {
  try {
    const { cron: cronExpression } = req.body;
    let existing = await Scheduler.findOne({ type: 'scraper' });
    if (existing) {
      existing.cron = cronExpression;
      existing = await existing.save();
    }
    if (scheduledCron) {
      scheduledCron.stop();
    }
    scheduledCron = cron.schedule(cronExpression, () => {
      run(existing);
    });
    console.log(`Cron schedule updated to '${cronExpression}'`);
    res.json(existing);
  } catch (error) {
    console.error('Failed to restart cron job:', error);
    res.status(500).json({ error: 'Failed to restart cron job' });
  }
});

// Insert default schedule if missing
async function insertDefaultCron() {
  const existing = await Scheduler.findOne({ type: 'scraper' });
  if (!existing) {
    const defaultCron = new Scheduler({
      type: 'scraper',
      status: 'stopped',
      cron: '*/5 * * * *',
      completedAt: new Date(),
    });
    await defaultCron.save();
  }
}

// Launch the scheduler on server startup
async function startScraper() {
  await resetStuckStatus();
  const existing = await Scheduler.findOne({ type: 'scraper' });
  if (existing) {
    scheduledCron = cron.schedule(existing.cron, () => {
      run(existing);
    });
  } else {
    console.error('No cron schedule found for scraper.');
  }
}

insertDefaultCron();
startScraper();

module.exports = router;
