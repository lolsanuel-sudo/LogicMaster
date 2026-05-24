import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { email: string; username: string; password: string; displayName?: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  getMe: () =>
    api.get('/api/auth/me'),
}

export const usersAPI = {
  getById: (id: string) =>
    api.get(`/api/users/${id}`),
  
  update: (id: string, data: { displayName?: string; bio?: string; avatar?: string }) =>
    api.put(`/api/users/${id}`, data),
  
  getStats: (id: string) =>
    api.get(`/api/users/${id}/stats`),
}

export const gamesAPI = {
  submitBomba: (data: { expression: string; values: Record<string, boolean>; answer: boolean; duration: number }) =>
    api.post('/api/games/bomba/submit', data),
  
  submitGuardia: (data: { question: string; answer: string; duration: number }) =>
    api.post('/api/games/guardia/submit', data),
  
  generate: (type: string, difficulty?: number) =>
    api.get(`/api/games/generate?type=${type}&difficulty=${difficulty || ''}`),
}

export const progressAPI = {
  getUserProgress: (id: string) =>
    api.get(`/api/progress/user/${id}`),
  
  getAchievements: () =>
    api.get('/api/progress/achievements'),
}

export const leaderboardAPI = {
  get: (params?: { limit?: number; offset?: number; sortBy?: string }) =>
    api.get('/api/leaderboard', { params }),
  
  getUserRank: (id: string, sortBy?: string) =>
    api.get(`/api/leaderboard/${id}/rank`, { params: { sortBy } }),
}

export default api
