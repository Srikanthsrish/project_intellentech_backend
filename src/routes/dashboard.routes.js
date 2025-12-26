const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { getViewerStats } = require('../controllers/dashboard.controller');

// Viewer / Admin / Manager can see stats
router.get(
  '/viewer-stats',
  
  getViewerStats
);

module.exports = router;
