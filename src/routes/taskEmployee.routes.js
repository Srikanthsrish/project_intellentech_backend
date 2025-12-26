const express = require("express");
const {
  getEmployeeTasks,
  submitTask,
  resetSubmittedTask
} = require("../controllers/taskEmployee.controller");

const router = express.Router();
const upload = require("../middleware/upload");
// Get all tasks of employee
router.get("/:employeeId", getEmployeeTasks);

// Submit task
router.put("/:employeeId/:taskId/submit",upload.single("file"), submitTask);

// Reset submission
router.put("/:employeeId/:taskId/reset", resetSubmittedTask);

module.exports = router;
