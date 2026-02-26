// API服务配置
// 功能：定义所有API接口，使用配置好的axios实例

import instance from './request';

// 认证相关API
const authApi = {
  // 登录
  login: (data: { username: string; password: string }) => {
    return instance.post('/auth/login', data);
  },
  
  // 注册
  register: (data: { username: string; email: string; password: string }) => {
    return instance.post('/auth/register', data);
  },
  
  // 退出登录
  logout: (data: { refreshToken: string }) => {
    return instance.post('/auth/logout', data);
  },
  
  // 刷新token
  refresh: (data: { refreshToken: string }) => {
    return instance.post('/auth/refresh', data);
  },
  
  // 获取用户信息
  getMe: () => {
    return instance.get('/auth/me');
  }
};

// 任务相关API
const todoApi = {
  // 获取所有任务
  getAll: () => {
    return instance.get('/todos');
  },
  
  // 根据日期获取任务
  getByDate: (date: string) => {
    return instance.get(`/todos/date/${date}`);
  },
  
  // 创建任务
  create: (data: any) => {
    return instance.post('/todos', data);
  },
  
  // 更新任务
  update: (id: string, data: any) => {
    return instance.put(`/todos/${id}`, data);
  },
  
  // 切换任务完成状态
  toggleCompleted: (id: string, completed: boolean) => {
    return instance.patch(`/todos/${id}/completed`, { completed });
  },
  
  // 删除任务
  delete: (id: string) => {
    return instance.delete(`/todos/${id}`);
  }
};

// 公司相关API
const companyApi = {
  // 获取所有公司
  getAll: () => {
    return instance.get('/companies');
  },
  
  // 获取单个公司
  getById: (id: string) => {
    return instance.get(`/companies/${id}`);
  },
  
  // 创建公司
  create: (data: any) => {
    return instance.post('/companies', data);
  },
  
  // 更新公司
  update: (id: string, data: any) => {
    return instance.put(`/companies/${id}`, data);
  },
  
  // 删除公司
  delete: (id: string) => {
    return instance.delete(`/companies/${id}`);
  }
};

// 面试计划相关API
const interviewPlanApi = {
  // 获取所有面试计划
  getAll: () => {
    return instance.get('/interview-plans');
  },
  
  // 获取单个面试计划
  getById: (id: string) => {
    return instance.get(`/interview-plans/${id}`);
  },
  
  // 创建面试计划
  create: (data: any) => {
    return instance.post('/interview-plans', data);
  },
  
  // 更新面试计划
  update: (id: string, data: any) => {
    return instance.put(`/interview-plans/${id}`, data);
  },
  
  // 删除面试计划
  delete: (id: string) => {
    return instance.delete(`/interview-plans/${id}`);
  }
};

// 导出API对象
const api = {
  todo: todoApi,
  company: companyApi,
  interviewPlan: interviewPlanApi,
  auth: authApi
};

export default api;