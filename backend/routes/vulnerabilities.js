const express = require('express');
const router = express.Router();
const Vulnerability = require('../models/Vulnerability');
const auth = require('../middleware/auth');

// Get all vulnerabilities or filter by query parameters (public)
router.get('/', async (req, res) => {
  try {
    const { severity, vendor } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;
    if (vendor) filter.vendor = vendor;

    const vulnerabilities = await Vulnerability.find(filter).sort({ published: -1 });
    res.json(vulnerabilities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new vulnerability (protected)
router.post('/add', auth, async (req, res) => {
  try {
    const vuln = new Vulnerability(req.body);
    await vuln.save();
    res.status(201).json(vuln);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a vulnerability (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const vuln = await Vulnerability.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vuln) return res.status(404).json({ error: 'Not found' });
    res.json(vuln);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a vulnerability (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vuln = await Vulnerability.findByIdAndDelete(req.params.id);
    if (!vuln) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalVulns = await Vulnerability.countDocuments();
    const criticalCount = await Vulnerability.countDocuments({ severity: { $in: ['Critical', 'High'] } });
    const activeThreats = await Vulnerability.countDocuments({ status: 'Active' });
    const resolvedCount = await Vulnerability.countDocuments({ status: 'Resolved' });

    res.json({
      totalVulns,
      criticalCount,
      activeThreats,
      resolvedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent vulnerabilities (last 10)
router.get('/recent', async (req, res) => {
  try {
    // Fetch vulnerabilities with valid published date only
    const recentVulns = await Vulnerability.find({ published: { $exists: true, $ne: null } })
      .sort({ published: -1 })
      .limit(10)
      .select('cve title vendor severity cvss status published');
    res.json(recentVulns);
  } catch (error) {
    console.error('Error in /recent route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a vulnerability by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const vuln = await Vulnerability.findById(req.params.id);
    if (!vuln) return res.status(404).json({ error: 'Not found' });
    res.json(vuln);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get severity distribution for charts
router.get('/charts/severity', async (req, res) => {
  try {
    const severityCounts = await Vulnerability.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const labels = severityCounts.map(item => item._id || 'Unknown');
    const data = severityCounts.map(item => item.count);

    res.json({ labels, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vulnerability trends (last 30 days)
router.get('/charts/trends', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Vulnerability.aggregate([
      { $match: { published: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$published' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const labels = trends.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = trends.map(item => item.count);

    res.json({ labels, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
