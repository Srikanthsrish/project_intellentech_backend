// routes/taskRoutes.js
const express = require("express");

const { getManagerViewTasks }=require( "../controllers/MangerTaskView.Controller");

const router = express.Router();

router.get("/:managerId/view-tasks", getManagerViewTasks);

 module.exports = router;
