const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee.controller');

const { protect} = require('../middleware/auth.middleware');
const {allowRoles}=require('../middleware/./role.middleware.js')
router.use(protect);
router.use(allowRoles('SuperAdmin'));

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
