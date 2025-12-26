// routes/task.routes.js
const express = require('express');
const router = express.Router();
const {
  getEmployees,
  assignTask,
  getManagerTasks,
  submitTask,
} = require('../controllers/task.controller');
const { protect} = require('../middleware/auth.middleware');
const {allowRoles}=require('../middleware/./role.middleware.js')
const { getAllTasks, deleteTask } = require('../controllers/task.controller');
router.use(protect);
const {
  getEmployeeTasks,
  submitEmployeeTask,
} = require('../controllers/task.controller');

// Manager
router.get('/employees', allowRoles('Manager'), getEmployees);
router.post('/assign', allowRoles('Manager'), assignTask);
router.get('/manager', allowRoles('Manager'), getManagerTasks);

// Employee
router.put('/submit/:id', allowRoles('Employee'), submitTask);
router.get('/', getAllTasks);
router.delete('/:id', deleteTask)
router.get('/employee/:id', getEmployeeTasks);


// 📤 Employee – Submit task link
router.put('/submit/:taskId', allowRoles('Employee'), submitEmployeeTask);
module.exports = router;
