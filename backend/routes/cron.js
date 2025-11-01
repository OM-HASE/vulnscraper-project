const express = require('express');
const router = express.Router();
const cron = require('node-cron');

const Scheduler = require('../models/Scheduler');
let scheduledCron = null;

const run = async (cron) => {
    console.log("Running scrapper....." + cron.cron);
    cron.completedAt = new Date();
    await cron.save();
};

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
          cron: "*/5 * * * * *",
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