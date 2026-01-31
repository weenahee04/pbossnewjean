import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = localStorage.getItem('jespark_auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'เกิดข้อผิดพลาด';

      switch (status) {
        case 401:
          toast.error('กรุณาเข้าสู่ระบบใหม่');
          localStorage.removeItem('jespark_auth');
          window.location.href = '/#/login';
          break;
        case 403:
          toast.error('คุณไม่มีสิทธิ์เข้าถึง');
          break;
        case 404:
          toast.error('ไม่พบข้อมูลที่ต้องการ');
          break;
        case 500:
          toast.error('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } else {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
