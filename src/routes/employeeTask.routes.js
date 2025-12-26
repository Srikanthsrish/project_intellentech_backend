// routes/employeeTask.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {allowRoles}=require('../middleware/./role.middleware.js')
const {
  getMyTasks,
  submitTask,
} = require('../controllers/employeeTask.controller');

router.use(protect, allowRoles('Employee'));

router.get('/tasks', getMyTasks);
router.put('/tasks/:id/submit', submitTask);

module.exports = router;
