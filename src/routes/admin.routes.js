const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { dashboardStats } = require('../controllers/admin.controller');

router.use(protect);
router.use(allowRoles('SuperAdmin'));

router.get('/dashboard', dashboardStats);

module.exports = router;
