const express = require('express');
const router = express.Router();
const { createLesson, getLessonsByCourse } = require('../controller/lessonController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/lessons', verifyToken, requireRole('instructor'), upload.single('video'), createLesson);
router.get('/lessons/:courseId', verifyToken, requireRole('student', 'instructor', 'admin'), getLessonsByCourse);

module.exports = router;
