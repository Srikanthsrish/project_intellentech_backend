const express =require("express");
const { getAllTasksForSuperAdmin } =require("../controllers/superAdminTask.Controller");

const router = express.Router();

router.get("/tasks", getAllTasksForSuperAdmin);

module.exports = router;
