const express = require("express");
const router = express.Router();
const { protect} = require('../middleware/auth.middleware');
const {allowRoles}=require('../middleware/./role.middleware.js')

const { assignManager, getManagers, getEmployees,getManagersWithEmployees,unassignEmployee } = require("../controllers/./superAdminManEmp.Controller");
router.use(protect);
router.use(allowRoles('SuperAdmin'));
router.put("/assign-manager", assignManager);

router.get("/managers", getManagers);

router.get("/employees", getEmployees);
router.get("/managers-with-employees", getManagersWithEmployees);

router.put("/unassign-employee", unassignEmployee);

module.exports = router;
    