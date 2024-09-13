import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:8000/api';

console.log(API_URL)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  console.log("API", API_URL)
  const response = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  console.log("API", API_URL)
  console.log("register")
  // console.log(response.data)
  
  return response.data.user;
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  console.log("Token", token)
  const response = await api.get('/auth/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data)
  return response.data;
};

export const saveScore = async (userId, score) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/scores', { userId, score }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getHighScore = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/scores/high/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.highScore;
};

export default api;