const express = require('express');
const router = express.Router();
const { enroll, getMyCourses, getAnalytics } = require('../controller/enrollmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/enroll', verifyToken, requireRole('student'), enroll);
router.get('/my-courses', verifyToken, requireRole('student'), getMyCourses);
router.get('/analytics', verifyToken, requireRole('admin'), getAnalytics);

module.exports = router;
