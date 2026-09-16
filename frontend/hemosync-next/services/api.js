import axios from 'axios'
import { getToken, clearToken, clearStoredRole } from '@/lib/utils'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hemosync.onrender.com/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('/auth/');
    if (err.response?.status === 401 && !isAuthRoute) {
      clearToken(); clearStoredRole()
      if (typeof window !== 'undefined') window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

// --- NEW BACKEND API CALLS ---
export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const verifyLoginOtp = async (email, otp) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const createBloodRequest = async (requestData) => {
  const { data } = await api.post('/requests', requestData);
  return data;
};

export const updateBloodRequest = async (id, statusData) => {
  const { data } = await api.put(`/requests/${id}`, statusData);
  return data;
};

export default api
