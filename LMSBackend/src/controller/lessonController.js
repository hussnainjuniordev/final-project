const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const createLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(500).json({ message: 'Video upload failed' });
    }

    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: 'Title and courseId are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const lesson = await Lesson.create({ title, videoUrl: req.file.path, courseId });

    return res.status(201).json(lesson);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLessonsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ createdAt: 1 });

    return res.status(200).json(lessons);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createLesson, getLessonsByCourse };
