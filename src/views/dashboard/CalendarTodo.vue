<!--
日历任务管理页面
用途：展示日历和任务管理功能，支持添加、编辑、删除任务
实现：使用Vue 3 Composition API，通过计算属性生成日历数据，连接后端API管理任务
功能：
- 日历视图展示，包含月份和星期
- 任务的添加、编辑、删除
- 任务状态管理
- 日期选择和任务筛选
- 后端API集成
-->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import api from '../../services/api'
import type { CreateTodoData } from '../../types'

// 任务类型定义
interface TodoItem {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 状态管理
const currentDate = ref(new Date())
const todos = ref<TodoItem[]>([])
const selectedDate = ref(formatDate(new Date()))
const loading = ref(false)
const error = ref<string | null>(null)

const showTodoModal = ref(false)
const isEditMode = ref(false)
const todoForm = ref({
  id: '',
  title: '',
  description: ''
})

// 计算当前月份的日历数据
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 获取当月第一天
  const firstDay = new Date(year, month, 1)
  // 获取当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  // 获取当月第一天是星期几
  const startDay = firstDay.getDay()
  // 获取当月的天数
  const daysInMonth = lastDay.getDate()

  const days = []

  // 添加上个月的日期
  for (let i = 1; i <= startDay; i++) {
    const prevDate = new Date(year, month, 1 - i)
    days.push({
      date: prevDate,
      isCurrentMonth: false,
      day: prevDate.getDate()
    })
  }

  // 添加当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = new Date(year, month, i)
    days.push({
      date: currentDay,
      isCurrentMonth: true,
      day: i
    })
  }

  // 添加下个月的日期
  const remainingDays = 42 - days.length // 6x7网格
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i)
    days.push({
      date: nextDate,
      isCurrentMonth: false,
      day: nextDate.getDate()
    })
  }

  return days
})

// 计算当前月份名称
const currentMonthName = computed(() => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return currentDate.value.toLocaleDateString('zh-CN', options)
})

// 切换到上个月
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

// 切换到下个月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// 切换到今天
const goToToday = () => {
  currentDate.value = new Date()
}

// 选择日期
const selectDate = (date: Date) => {
  selectedDate.value = formatDate(date)
  // 不再自动弹框，而是在任务卡片中添加按钮
}

// 获取某天的任务数量
const getTodoCountForDate = (date: Date) => {
  const dateStr = formatDate(date)
  return todos.value.filter(todo => todo.date === dateStr).length
}

// 获取某天的已完成任务数量
const getCompletedTodoCountForDate = (date: Date) => {
  const dateStr = formatDate(date)
  return todos.value.filter(todo => todo.date === dateStr && todo.completed).length
}

// 重置任务表单
const resetTodoForm = () => {
  todoForm.value = {
    id: '',
    title: '',
    description: ''
  }
}

// 打开编辑任务模态框
const openEditModal = (todo: TodoItem) => {
  todoForm.value = {
    id: todo.id,
    title: todo.title,
    description: todo.description
  }
  isEditMode.value = true
  showTodoModal.value = true
}

// 打开新建任务模态框
const openAddModal = () => {
  resetTodoForm()
  isEditMode.value = false
  showTodoModal.value = true
}

// 获取选中日期的任务
const selectedDateTodos = computed(() => {
  if (!selectedDate.value) return []
  return todos.value.filter(todo => todo.date === selectedDate.value)
})

// 加载任务
const loadTodos = async (date?: string) => {
  loading.value = true
  error.value = null
  try {
    if (date) {
      // 加载指定日期的任务
      const data = await api.todo.getByDate(date)
      todos.value = data.data || []
    } else {
      // 加载所有任务
      const data = await api.todo.getAll()
      todos.value = data.data || []
    }
  } catch (err) {
    console.error('加载任务失败:', err)
    error.value = '加载任务失败，请稍后重试'
    todos.value = []
  } finally {
    loading.value = false
  }
}

// 保存任务（新建或编辑）
const saveTodo = async () => {
  if (!todoForm.value.title || !selectedDate.value) {
    return
  }

  loading.value = true
  error.value = null

  try {
    if (isEditMode.value) {
      // 编辑模式
      const todoToUpdate = todos.value.find(t => t.id === todoForm.value.id)
      if (!todoToUpdate) {
        throw new Error('任务不存在')
      }

      await api.todo.update(todoForm.value.id, {
        date: todoToUpdate.date,
        title: todoForm.value.title,
        description: todoForm.value.description || '',
        completed: todoToUpdate.completed
      })
    } else {
      // 新建模式
      const todoData = {
        date: selectedDate.value,
        title: todoForm.value.title,
        description: todoForm.value.description || '',
        completed: false
      } as CreateTodoData

      await api.todo.create(todoData)
    }
    
    await loadTodos() // 加载所有任务
    resetTodoForm()
    showTodoModal.value = false
  } catch (err) {
    console.error('保存任务失败:', err)
    error.value = isEditMode.value ? '编辑任务失败，请稍后重试' : '添加任务失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 切换任务完成状态
const toggleTodoCompleted = async (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (!todo) return

  loading.value = true
  error.value = null

  try {
    await api.todo.toggleCompleted(id, !todo.completed)
    await loadTodos() // 加载所有任务
  } catch (err) {
    console.error('更新任务状态失败:', err)
    error.value = '更新任务状态失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 删除任务
const deleteTodo = async (id: string) => {
  loading.value = true
  error.value = null

  try {
    await api.todo.delete(id)
    await loadTodos() // 加载所有任务
  } catch (err) {
    console.error('删除任务失败:', err)
    error.value = '删除任务失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 监听选中日期变化，不需要重新加载任务，因为我们已经加载了所有任务
watch(selectedDate, (newDate) => {
  // 不需要在这里加载任务，因为我们已经加载了所有任务
})

// 初始化加载所有任务
onMounted(() => {
  loadTodos() // 不传参数，加载所有任务
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        日历任务管理
      </h1>
    </div>

    <div class="calendar-todo-container">
      <!-- 日历部分 -->
      <div class="calendar-section">
        <div class="calendar-header">
          <button class="btn btn-secondary" @click="prevMonth">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 class="month-title">{{ currentMonthName }}</h2>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="goToToday">今天</button>
            <button class="btn btn-secondary" @click="nextMonth">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 星期标题 -->
        <div class="weekdays">
          <div class="weekday">日</div>
          <div class="weekday">一</div>
          <div class="weekday">二</div>
          <div class="weekday">三</div>
          <div class="weekday">四</div>
          <div class="weekday">五</div>
          <div class="weekday">六</div>
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day" :class="{
            'other-month': !day.isCurrentMonth,
            'selected': selectedDate === formatDate(day.date),
            'has-todos': getTodoCountForDate(day.date) > 0
          }" @click="selectDate(day.date)">
            <div class="day-number">{{ day.day }}</div>
            <div v-if="getTodoCountForDate(day.date) > 0" class="todo-indicator">
              <span class="todo-count">{{ getCompletedTodoCountForDate(day.date) }}/{{ getTodoCountForDate(day.date)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务列表部分 -->
      <div class="todo-section">
        <div class="todo-header">
          <h2 class="todo-title">
            {{ selectedDate ? `${selectedDate} 的任务` : '任务列表' }}
          </h2>
          <button v-if="selectedDate" class="btn btn-primary" @click="openAddModal" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <div class="todo-list">
          <div v-if="loading" class="loading-state">
            <p>加载中...</p>
          </div>
          <div v-else-if="selectedDateTodos.length === 0" class="empty-state">
            <p>{{ selectedDate ? `暂无 ${selectedDate} 的任务` : '请选择日期添加任务' }}</p>
          </div>
          <div v-else class="todo-items">
            <div v-for="todo in selectedDateTodos" :key="todo.id" class="todo-item"
              :class="{ 'completed': todo.completed }">
              <div class="todo-checkbox">
                <input type="checkbox" :checked="todo.completed" @change="toggleTodoCompleted(todo.id)"
                  :disabled="loading" />
              </div>
              <div class="todo-content" @click="openEditModal(todo)">
                <h3 class="todo-title">{{ todo.title }}</h3>
                <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
              </div>
              <div class="todo-actions">
                <button class="btn btn-secondary btn-sm mr-2" @click.stop="openEditModal(todo)" :disabled="loading">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="btn btn-danger btn-sm" @click.stop="deleteTodo(todo.id)" :disabled="loading">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 任务模态框（新建/编辑） -->
    <Dialog :visible="showTodoModal" :title="isEditMode ? '编辑任务' : `添加任务 - ${selectedDate}`" @close="showTodoModal = false">
      <template #body>
        <form @submit.prevent="saveTodo">
          <div class="form-group">
            <label for="todo-title" class="form-label">任务标题</label>
            <input id="todo-title" v-model="todoForm.title" type="text" class="form-input" placeholder="请输入任务标题"
              required />
          </div>
          <div class="form-group">
            <label for="todo-description" class="form-label">任务描述</label>
            <textarea id="todo-description" v-model="todoForm.description" class="form-input" placeholder="请输入任务描述"
              rows="3"></textarea>
          </div>
        </form>
      </template>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="showTodoModal = false" :disabled="loading">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="saveTodo" :disabled="loading">
          {{ loading ? (isEditMode ? '保存中...' : '添加中...') : (isEditMode ? '保存' : '添加任务') }}
        </button>
      </template>
    </Dialog>

    
  </div>


</template>

<style scoped>
.page-container {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-todo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
}

/* 日历部分样式 */
.calendar-section {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px var(--color-shadow);
  padding: var(--spacing-md);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.month-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.weekday {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--spacing-sm);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-xs);
}

.calendar-day {
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding: var(--spacing-xs);
}

.calendar-day:hover {
  background-color: var(--color-bg-secondary);
}

.calendar-day.selected {
  background-color: var(--color-bg-secondary);
}

.calendar-day.other-month {
  color: var(--color-text-tertiary);
}

.day-number {
  font-size: var(--font-size-base);
  font-weight: 500;
}

.todo-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  background-color: var(--color-primary);
  color: white;
  padding: 1px 1px;
  border-radius: var(--radius-sm);
  max-width: 90%;
  text-align: center;
}

/* 任务列表部分样式 */
.todo-section {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px var(--color-shadow);
  padding: var(--spacing-md);
}

.todo-header {
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.error-message {
  text-align: center;
  padding: var(--spacing-md);
  color: #ef4444;
  font-size: var(--font-size-sm);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.todo-item {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.todo-content {
  flex: 1;
  cursor: pointer;
}

.todo-content:hover {
  opacity: 0.8;
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.todo-actions .btn-sm {
  padding: var(--spacing-xs);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-item:hover {
  box-shadow: 0 2px 4px var(--color-shadow);
  transform: translateY(-1px);
  border-color: var(--color-primary);
}

.todo-item.completed {
  opacity: 0.7;
  background-color: var(--color-bg-tertiary);
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.todo-checkbox {
  flex-shrink: 0;
}

.todo-content {
  flex: 1;
}

.todo-item .todo-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.todo-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 按钮样式 */
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
</style>