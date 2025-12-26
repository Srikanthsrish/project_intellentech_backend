// const router = require('express').Router();
// // const auth = require('../services/./');
// // const rbac = require('../middleware/rbac.middleware');
// const { createUser, getUsers } = require('../controllers/user.controller');


// router.post('/', createUser);
// router.get('/', getUsers);


// // module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const { getAllUsers } = require('../controllers/user.controller');

// Viewer can ONLY view users
router.get(
  '/',
  
  getAllUsers
);

module.exports = router;
