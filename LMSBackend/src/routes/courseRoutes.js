const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controller/courseController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', verifyToken, requireRole('instructor'), createCourse);
router.put('/courses/:id', verifyToken, requireRole('instructor', 'admin'), updateCourse);
router.delete('/courses/:id', verifyToken, requireRole('instructor', 'admin'), deleteCourse);

module.exports = router;
