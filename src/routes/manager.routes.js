const express = require('express');
const router = express.Router();

const {
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
  sendMessageToManager
} = require('../controllers/manager.controller');
const {allowRoles}=require('../middleware/./role.middleware.js')
const { protect } = require('../middleware/auth.middleware');
const { addManager } = require('../controllers/manager.controller');
// 🔐 Protect all manager routes
router.use(protect);
router.use(allowRoles('SuperAdmin'));

// ===============================
// MANAGER ROUTES
// ===============================
router.get('/', getManagers);                // Get all managers
router.get('/:id', getManagerById);          // Get single manager
router.put('/:id', updateManager);           // Update manager
router.delete('/:id', deleteManager);         // Delete manager
router.post('/:id/message', sendMessageToManager); // Send email


router.post('/', addManager); // ✅ ADD MANAGER

module.exports = router;
