const express = require('express');
const router = express.Router();
const { createLesson, getLessonsByCourse, deleteLesson } = require('../controller/lessonController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// POST   /api/lessons                  — upload a lesson (instructor only)
router.post('/lessons',
  verifyToken, requireRole('instructor'),
  upload.single('video'),
  createLesson
);

// GET    /api/lessons/course/:courseId — get all lessons for a course
router.get('/lessons/course/:courseId',
  verifyToken, requireRole('student', 'instructor', 'admin'),
  getLessonsByCourse
);

// DELETE /api/lessons/:id              — delete a lesson (instructor/admin)
router.delete('/lessons/:id',
  verifyToken, requireRole('instructor', 'admin'),
  deleteLesson
);

module.exports = router;
