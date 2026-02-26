export interface Company {
  id: string
  name: string
  description: string
  position: string
  salary: string
  createdAt: string
  updatedAt: string
}

export interface InterviewPlan {
  id: string
  company: Company
  date: string
  time: string
  location: string
  notes: string
  status: 'pending' | 'completed' | 'canceled'
  createdAt: string
  updatedAt: string
}

export interface TodoItem {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTodoData {
  date: string
  title: string
  description?: string
  completed?: boolean
}

export interface UpdateTodoData {
  date: string
  title: string
  description?: string
  completed: boolean
}

export interface CompanyApiResponse {
  status: number
  data: Company[]
}

export interface InterviewPlanApiResponse {
  status: number
  data: InterviewPlan[]
}

export interface CreateCompanyData {
  name: string
  description?: string
  position: string
  salary?: string
}