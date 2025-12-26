const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createTask,
  deleteTask,
  updateTaskStatus
} = require("../controllers/Managertask.Controller");
const upload = require("../middleware/upload");
router.get("/employees", getEmployees); // ?managerId=...
router.post("/tasks",  upload.single("file"),createTask);       // body: { employeeId, title, taskUrl, deadline }
router.delete("/tasks/:employeeId/:taskId", deleteTask);
router.put("/tasks/:employeeId/:taskId", updateTaskStatus);

module.exports = router;
