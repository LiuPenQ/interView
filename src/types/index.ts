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