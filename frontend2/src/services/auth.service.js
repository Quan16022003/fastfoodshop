import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const API_URL = `${API_CONFIG.BASE_URL}/auth`;

// Tạo instance axios với cấu hình chung
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const register = async (email, password, confirmPassword, fullname) => {
  try {
    const { data } = await api.post('/signup', {
      email,
      password, 
      confirmPassword,
      fullname
    });
    return data;
  } catch (error) {
    throw error?.response?.data || new Error('Lỗi đăng ký');
  }
};

const login = async (email, password) => {
  try {
    const { data } = await api.post('/signin', { email, password });
    return data;
  } catch (error) {
    throw error?.response?.data?.message || 'Lỗi kết nối server';
  }
};

const logout = async () => {
  try {
    await api.post('/signout');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error?.response?.data || error.message);
  }
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
