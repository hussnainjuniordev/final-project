const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  videoUrl: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

lessonSchema.index({ courseId: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
