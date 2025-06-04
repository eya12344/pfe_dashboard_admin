import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Créer une instance axios avec une configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Services d'authentification
export const authService = {
  signIn: (email: string, password: string) => 
    api.post('/auth/signin', { email, password }),
  
  signUp: (email: string, password: string, name: string) => 
    api.post('/auth/signup', { email, password, name }),
  
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Autres services API
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export default api;