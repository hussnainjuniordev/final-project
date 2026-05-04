import api from './api.js';

export const getUsers = () => api.get('/api/users');
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
export const getProfile = () => api.get('/api/users/profile');
