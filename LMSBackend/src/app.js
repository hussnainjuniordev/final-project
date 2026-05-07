const express = require('express');
const cors = require('cors');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');

const app = express();

const authRoutes       = require('./routes/authRoutes');
const courseRoutes     = require('./routes/courseRoutes');
const lessonRoutes     = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const userRoutes       = require('./routes/userRoutes');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMiddleware);

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to LMS Backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', lessonRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', userRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
