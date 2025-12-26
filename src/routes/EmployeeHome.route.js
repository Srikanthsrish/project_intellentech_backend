const express = require("express");
const router = express.Router();
const { getEmployeeTaskSummary } = require("../controllers/EmployeeHome.controller");

router.get("/:employeeId/summary", getEmployeeTaskSummary);

module.exports = router;
