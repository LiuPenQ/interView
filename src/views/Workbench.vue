<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import CompanyModal from '../components/CompanyModal.vue'
import { api } from '../services/api'
import type { CompanyApiResponse, InterviewPlanApiResponse, CreateCompanyData } from '../services/api'

// 本地使用的公司类型
interface Company {
  id: string
  name: string
  description: string
  position: string
  salary: string
  createdAt: string
  updatedAt: string
}

// 本地使用的面试计划类型
interface InterviewPlan {
  id: string
  company: Company
  date: string
  time: string
  location: string
  notes: string
  status: string
  createdAt: string
  updatedAt: string
}

const companies = ref<Company[]>([])
const interviewPlans = ref<InterviewPlan[]>([])
const isModalOpen = ref(false)
const isLoading = ref(false)

const loadData = async () => {
  try {
    isLoading.value = true
    const [companiesData, plansData] = await Promise.all([
      api.company.getAll(),
      api.interviewPlan.getAll()
    ])
    
    companies.value = (companiesData as CompanyApiResponse[]).map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      position: c.position,
      salary: c.salary,
      createdAt: c.created_at,
      updatedAt: c.updated_at
    }))
    
    interviewPlans.value = (plansData as InterviewPlanApiResponse[]).map(p => ({
              id: p.id,
              company: {
                id: p.company_id,
                name: p.company_name || '',
                position: p.company_position || '',
                description: '',
                salary: '',
                createdAt: '',
                updatedAt: ''
              },
              date: p.date,
              time: p.time,
              location: p.location || '',
              notes: p.notes || '',
              status: p.status,
              createdAt: p.created_at,
              updatedAt: p.updated_at
            }))
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
}

const addCompany = async (companyData: CreateCompanyData) => {
  try {
    console.log('Creating company with data:', companyData)
    const newCompany = await api.company.create(companyData)
    console.log('Created company:', newCompany)
    companies.value.push({
      id: newCompany.id,
      name: newCompany.name,
      description: newCompany.description,
      position: newCompany.position,
      salary: newCompany.salary,
      createdAt: newCompany.created_at,
      updatedAt: newCompany.updated_at
    })
    // 保存成功后关闭弹框
    closeModal()
    // 刷新列表
    await loadData()
  } catch (error) {
    console.error('Failed to create company:', error)
  }
}

const addInterviewPlan = async (company: Company) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const newPlan = await api.interviewPlan.create({
      company_id: company.id,
      date: today!,
      time: '10:00',
      location: '',
      notes: '',
      status: 'pending'
    })
    
    interviewPlans.value.push({
      id: newPlan.id,
      company: {
        id: newPlan.company_id,
        name: newPlan.company_name || '',
        position: newPlan.company_position || '',
        description: '',
        salary: '',
        createdAt: '',
        updatedAt: ''
      },
      date: newPlan.date,
      time: newPlan.time,
      location: newPlan.location || '',
      notes: newPlan.notes || '',
      status: newPlan.status,
      createdAt: newPlan.created_at,
      updatedAt: newPlan.updated_at
    })
  } catch (error) {
    console.error('Failed to create interview plan:', error)
  }
}

const deleteCompany = async (companyId: string) => {
  try {
    await api.company.delete(companyId)
    companies.value = companies.value.filter(c => c.id !== companyId)
    interviewPlans.value = interviewPlans.value.filter(p => p.company.id !== companyId)
  } catch (error) {
    console.error('Failed to delete company:', error)
  }
}

const deleteInterviewPlan = async (planId: string) => {
  try {
    await api.interviewPlan.delete(planId)
    interviewPlans.value = interviewPlans.value.filter(p => p.id !== planId)
  } catch (error) {
    console.error('Failed to delete interview plan:', error)
  }
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="workbench-container">
    <div class="page-header">
      <h1 class="page-title">面试计划</h1>
      <button class="btn btn-primary" @click="openModal">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新建公司
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <p>加载中...</p>
    </div>
    
    <div v-else class="grid-layout">
      <!-- 公司列表 -->
      <div class="card">
        <h2 class="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          心仪公司
        </h2>
        
        <draggable 
          v-model="companies" 
          item-key="id"
          class="company-list"
          ghost-class="ghost-item"
          drag-class="dragging-item"
          :animation="150"
          :delay="0"
          :delay-on-touch-only="false"
          :force-fallback="true"
          :fallback-tolerance="1"
          :fallback-on-body="true"
          :fallback-cursor="'grabbing'"
          handle=".drag-handle"
        >
          <template #item="{ element }">
            <div class="company-item">
              <div class="item-header">
                <div class="drag-handle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                <div class="company-actions">
                  <button 
                    class="btn btn-sm btn-secondary" 
                    @click="addInterviewPlan(element)"
                    title="添加面试计划"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteCompany(element.id)"
                    title="删除公司"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="company-info">
                <h3 class="company-name">{{ element.name }} {{ element.salary }}</h3>
                <p class="company-position">{{ element.position }}</p>
                <p class="company-description">{{ element.description }}</p>
              </div>
            </div>
          </template>
        </draggable>
        
        <div v-if="companies.length === 0" class="empty-state">
          <p>暂无公司，点击右上角"新建公司"按钮添加</p>
        </div>
      </div>
      
      <!-- 面试计划 -->
      <div class="card">
        <h2 class="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          面试计划
        </h2>
        
        <draggable 
          v-model="interviewPlans" 
          item-key="id"
          class="interview-list"
          ghost-class="ghost-item"
          drag-class="dragging-item"
          :animation="150"
          :delay="0"
          :delay-on-touch-only="false"
          :force-fallback="true"
          :fallback-tolerance="1"
          :fallback-on-body="true"
          :fallback-cursor="'grabbing'"
          handle=".drag-handle"
        >
          <template #item="{ element }">
            <div class="interview-item">
              <div class="item-header">
                <div class="drag-handle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                <div class="company-actions">
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteInterviewPlan(element.id)"
                    title="删除面试计划"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="interview-header">
                <h3 class="interview-company">{{ element.company.name }}</h3>
                <span class="interview-status" :class="`status-${element.status}`">
                  {{ element.status === 'pending' ? '待面试' : element.status === 'completed' ? '已完成' : '已取消' }}
                </span>
              </div>
              <div class="interview-info">
                <p class="interview-date">{{ element.date }} {{ element.time }}</p>
                <p class="interview-position">{{ element.company.position }}</p>
                <p v-if="element.notes" class="interview-notes">{{ element.notes }}</p>
              </div>
            </div>
          </template>
        </draggable>
        
        <div v-if="interviewPlans.length === 0" class="empty-state">
          <p>暂无面试计划，点击公司卡片的"添加面试计划"按钮</p>
        </div>
      </div>
    </div>
    
    <!-- 新建公司模态框 -->
    <CompanyModal
      :is-open="isModalOpen"
      @close="closeModal"
      @save="addCompany"
    />
  </div>
</template>

<style scoped>
.workbench-container {
  padding: var(--spacing-xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 768px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px var(--color-shadow);
  padding: var(--spacing-md);
  min-height: 300px;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
}

.company-list,
.interview-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.company-item,
.interview-item {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  position: relative;
  cursor: grab;
}

.company-item:hover,
.interview-item:hover {
  box-shadow: 0 2px 4px var(--color-shadow);
  transform: translateY(-1px);
  border-color: var(--color-primary);
}

.company-item:active,
.interview-item:active {
  cursor: grabbing;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xs);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-text-tertiary);
  cursor: grab;
  transition: all 0.2s ease;
  border-radius: var(--radius-sm);
}

.drag-handle:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

.drag-handle:active {
  cursor: grabbing;
}

.company-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.ghost-item {
  opacity: 0.4;
  background-color: var(--color-bg-tertiary);
  border: 2px dashed var(--color-primary);
}

.dragging-item {
  opacity: 0.9;
  transform: scale(1.01);
  box-shadow: 0 8px 16px var(--color-shadow);
  z-index: 9999;
  background-color: var(--color-bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  cursor: grabbing;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.company-position {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.company-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
}

.company-salary {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
}

.company-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interview-company {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.interview-status {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.status-pending {
  background-color: #fbbf24;
  color: #78350f;
}

.status-completed {
  background-color: #10b981;
  color: #047857;
}

.status-canceled {
  background-color: #ef4444;
  color: #7f1d1d;
}

.interview-info {
  flex: 1;
}

.interview-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
}

.interview-position {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.interview-notes {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background-color: var(--color-border);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
}

[v-cloak] {
  display: none;
}
</style>