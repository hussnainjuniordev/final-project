import api from './api.js';

export const enroll       = (courseId)           => api.post('/api/enroll', { courseId });
export const getMyCourses = ()                   => api.get('/api/my-courses');
export const getProgress  = (courseId)           => api.get(`/api/enroll/${courseId}/progress`);
export const markWatched  = (courseId, lessonId) => api.patch(`/api/enroll/${courseId}/watched`, { lessonId });
