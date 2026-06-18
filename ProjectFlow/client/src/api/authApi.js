import API from './axios';

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (data) => API.post('/auth/register', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
