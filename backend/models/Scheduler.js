const mongoose = require('mongoose');

const schedulerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  status: { type: String, enum: ['stopped', 'running', 'completed', 'failed'], default: 'running' },
  cron: { type: String, required: true },
  completedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Scheduler', schedulerSchema);
