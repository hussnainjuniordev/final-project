const express = require('express');
const router = express.Router();
const { enroll, getMyCourses, getProgress, markWatched, getAnalytics } = require('../controller/enrollmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/enroll',                              verifyToken, requireRole('student'), enroll);
router.get('/my-courses',                           verifyToken, requireRole('student'), getMyCourses);
router.get('/enroll/:courseId/progress',            verifyToken, requireRole('student'), getProgress);
router.patch('/enroll/:courseId/watched',           verifyToken, requireRole('student'), markWatched);
router.get('/analytics',                            verifyToken, requireRole('admin'),   getAnalytics);

module.exports = router;
