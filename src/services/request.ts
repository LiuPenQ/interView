// 网络请求配置
// 功能：配置axios实例，实现请求拦截、响应拦截和token无感刷新

import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, removeAccessToken, removeUserInfo } from '../utils/auth';
import api from './api';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 刷新token的函数
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    // 使用实际的后端API
    const result = await api.auth.refresh({ refreshToken });

    if (result.status === 200) {
      const newAccessToken = result.data.accessToken;
      setAccessToken(newAccessToken);
      
      // 保存新的refresh token
      if (result.data.refreshToken) {
        setRefreshToken(result.data.refreshToken);
      }
      
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error('刷新token失败:', error);
    return null;
  }
};

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 处理401错误（token过期）
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新token，将请求加入队列
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          // 更新请求头中的token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // 执行队列中的请求
          refreshSubscribers.forEach((callback) => callback(newToken));
          refreshSubscribers = [];
          
          return instance(originalRequest);
        } else {
          // 刷新token失败，跳转到登录页
          removeAccessToken();
          removeUserInfo();
          router.push('/login');
          return Promise.reject(error);
        }
      } catch (err) {
        // 刷新token失败，跳转到登录页
        removeAccessToken();
        removeUserInfo();
        router.push('/login');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 处理其他错误
    if (error.response) {
      ElMessage.error(error.response.data.msg || '请求失败');
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接');
    } else {
      ElMessage.error('请求失败，请稍后重试');
    }

    return Promise.reject(error);
  }
);

export default instance;