import http from './request';

// API响应类型
interface ApiResponse<T> {
  status: number;
  data: T;
  msg?: string;
}

// 公司API响应类型（后端返回）
export interface CompanyApiResponse {
  id: string;
  name: string;
  description: string;
  position: string;
  salary: string;
  created_at: string;
  updated_at: string;
}

// 面试计划API响应类型（后端返回）
export interface InterviewPlanApiResponse {
  id: string;
  company_id: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  company_position?: string;
}

// 创建公司的数据类型
export interface CreateCompanyData {
  name: string;
  description: string;
  position: string;
  salary: string;
}

// 更新公司的数据类型
export interface UpdateCompanyData {
  name: string;
  description: string;
  position: string;
  salary: string;
}

// 创建面试计划的数据类型
export interface CreateInterviewPlanData {
  company_id: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  status?: string;
}

// 更新面试计划的数据类型
export interface UpdateInterviewPlanData {
  company_id: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  status: string;
}

// 公司相关API
export const companyApi = {
  // 获取所有公司
  getAll: (): Promise<CompanyApiResponse[]> => {
    return http.get('/companies');
  },
  
  // 获取单个公司
  getOne: (id: string): Promise<CompanyApiResponse> => {
    return http.get(`/companies/${id}`);
  },
  
  // 创建公司
  create: (data: CreateCompanyData): Promise<CompanyApiResponse> => {
    return http.post('/companies', data);
  },
  
  // 更新公司
  update: (id: string, data: UpdateCompanyData): Promise<CompanyApiResponse> => {
    return http.put(`/companies/${id}`, data);
  },
  
  // 删除公司
  delete: (id: string): Promise<{ message: string }> => {
    return http.delete(`/companies/${id}`);
  },
};

// 面试计划相关API
export const interviewPlanApi = {
  // 获取所有面试计划
  getAll: (): Promise<InterviewPlanApiResponse[]> => {
    return http.get('/interview-plans');
  },
  
  // 获取单个面试计划
  getOne: (id: string): Promise<InterviewPlanApiResponse> => {
    return http.get(`/interview-plans/${id}`);
  },
  
  // 创建面试计划
  create: (data: CreateInterviewPlanData): Promise<InterviewPlanApiResponse> => {
    return http.post('/interview-plans', data);
  },
  
  // 更新面试计划
  update: (id: string, data: UpdateInterviewPlanData): Promise<InterviewPlanApiResponse> => {
    return http.put(`/interview-plans/${id}`, data);
  },
  
  // 删除面试计划
  delete: (id: string): Promise<{ message: string }> => {
    return http.delete(`/interview-plans/${id}`);
  },
};

// 导出所有API
export const api = {
  company: companyApi,
  interviewPlan: interviewPlanApi,
};