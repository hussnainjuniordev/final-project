const Enrollment = require('../models/Enrollment');

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

module.exports = { enroll, getMyCourses, getAnalytics };
