const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const createLesson = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Video upload failed — no file received' });
    }

    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: 'Title and courseId are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only the course owner can upload lessons
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

// DELETE /api/lessons/:id — admin can delete any, instructor can only delete their own course's lessons
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // For instructors, verify they own the course this lesson belongs to
    if (req.user.role === 'instructor') {
      const course = await Course.findById(lesson.courseId);
      if (!course || course.instructor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    await lesson.deleteOne();
    return res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createLesson, getLessonsByCourse, deleteLesson };
