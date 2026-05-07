const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

const enroll = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) {
      return res.status(409).json({ message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      progress: 0,
      watchedLessons: [],
    });

    return res.status(201).json(enrollment);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
    const courses = enrollments.map((e) => e.course);
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/enroll/:courseId/progress — get watched lessons for a course
const getProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json({
      progress: enrollment.progress,
      watchedLessons: enrollment.watchedLessons,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/enroll/:courseId/watched — mark a lesson as watched
const markWatched = async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add lessonId only if not already watched
    if (!enrollment.watchedLessons.map(String).includes(lessonId)) {
      enrollment.watchedLessons.push(lessonId);
    }

    // Recalculate progress based on total lessons in the course
    const totalLessons = await Lesson.countDocuments({ courseId: req.params.courseId });
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.watchedLessons.length / totalLessons) * 100)
      : 0;

    await enrollment.save();

    return res.status(200).json({
      progress: enrollment.progress,
      watchedLessons: enrollment.watchedLessons,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const analytics = await Enrollment.aggregate([
      { $group: { _id: '$course', totalEnrollments: { $sum: 1 } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { courseTitle: '$course.title', totalEnrollments: 1 } },
    ]);

    return res.status(200).json(analytics);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { enroll, getMyCourses, getProgress, markWatched, getAnalytics };
