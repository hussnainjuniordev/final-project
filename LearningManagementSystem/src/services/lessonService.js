import api from './api.js';

export const getLessons = (courseId) => api.get(`/api/lessons/${courseId}`);
export const createLesson = (formData) =>
  api.post('/api/lessons', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
