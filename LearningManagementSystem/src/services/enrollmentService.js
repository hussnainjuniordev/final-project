import api from './api.js';

export const enroll = (courseId) => api.post('/api/enroll', { courseId });
export const getMyCourses = () => api.get('/api/my-courses');
