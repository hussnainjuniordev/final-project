import api from './api.js';

export const getLessons   = (courseId) => api.get(`/api/lessons/course/${courseId}`);
export const deleteLesson = (lessonId) => api.delete(`/api/lessons/${lessonId}`);
export const createLesson = (formData) =>
  api.post('/api/lessons', formData, {
    headers: { 'Content-Type': undefined }, // let browser set multipart boundary automatically
  });
