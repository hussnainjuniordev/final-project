const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getProfile } = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/users', verifyToken, requireRole('admin'), getAllUsers);
router.delete('/users/:id', verifyToken, requireRole('admin'), deleteUser);
router.get('/users/profile', verifyToken, getProfile);

module.exports = router;
