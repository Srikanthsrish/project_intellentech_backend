const express = require('express');
const router = express.Router();
const { getEmployeeCount } = require('../controllers/managerDashboard.controller');
const { protect} = require('../middleware/auth.middleware');
const {allowRoles}=require('../middleware/./role.middleware.js')
router.use(protect);
router.use(allowRoles('Manager'));

router.get('/employee-count', getEmployeeCount);

module.exports = router;
