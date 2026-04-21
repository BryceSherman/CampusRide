import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusride_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  },

  verify: async () => {
    try {
      const response = await api.post('/api/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Failed to verify token:', error);
      throw error;
    }
  },

  getUserProfile: async (email) => {
    try {
      const response = await api.get('/api/users/me', {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },
};

// User endpoints
export const userService = {
  getProfile: async (email) => {
    try {
      const response = await api.get('/api/users/me', {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  updateProfile: async (email, userData) => {
    try {
      const response = await api.put('/api/users/me', {
        email,
        ...userData,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
};

// Ride endpoints
export const rideService = {
  createRide: async (rideData) => {
    try {
      const response = await api.post('/api/rides', rideData);
      return response.data;
    } catch (error) {
      console.error('Failed to create ride:', error);
      throw error;
    }
  },

  getRides: async (filters = {}) => {
    try {
      const response = await api.get('/api/rides', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rides:', error);
      throw error;
    }
  },

  getAvailableRides: async (filters = {}) => {
    try {
      const response = await api.get('/api/rides/available', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch available rides:', error);
      throw error;
    }
  },

  getRideById: async (rideId) => {
    try {
      const response = await api.get(`/api/rides/${rideId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ride:', error);
      throw error;
    }
  },

  updateRideStatus: async (rideId, status) => {
    try {
      const response = await api.patch(`/api/rides/${rideId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update ride status:', error);
      throw error;
    }
  },

  acceptRide: async (rideId) => {
    try {
      const response = await api.patch(`/api/rides/${rideId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Failed to accept ride:', error);
      throw error;
    }
  },

  completeRide: async (rideId, durationMinutes) => {
    try {
      const response = await api.patch(`/api/rides/${rideId}/complete`, { durationMinutes });
      return response.data;
    } catch (error) {
      console.error('Failed to complete ride:', error);
      throw error;
    }
  },

  cancelRide: async (rideId, email) => {
    try {
      const response = await api.patch(`/api/rides/${rideId}/cancel`, { email });
      return response.data;
    } catch (error) {
      console.error('Failed to cancel ride:', error);
      throw error;
    }
  },

  markInProgress: async (rideId) => {
    try {
      const response = await api.patch(`/api/rides/${rideId}/in-progress`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark ride in progress:', error);
      throw error;
    }
  },
};

export default api;

