import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

// API基础URL
const BASE_URL = 'http://localhost:3004/api';

// 请求配置
const requestConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建axios实例
const http: AxiosInstance = axios.create(requestConfig);

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (data.status === 200 || data.status === 201) {
      return data.data;
    } else {
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
  },
  (error) => {
    console.error('网络错误:', error);
    return Promise.reject(error);
  }
);

// 导出请求方法
export default http;
export type { AxiosRequestConfig };