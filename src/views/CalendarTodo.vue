<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 任务类型定义
interface TodoItem {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

// 状态管理
const currentDate = ref(new Date())
const todos = ref<TodoItem[]>([])
const selectedDate = ref(new Date().toISOString().split('T')[0] || '')
const showAddModal = ref(false)
const newTodo = ref({
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
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i)
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
  selectedDate.value = date.toISOString().split('T')[0] || ''
  // 不再自动弹框，而是在任务卡片中添加按钮
}

// 获取某天的任务数量
const getTodoCountForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]
  return todos.value.filter(todo => todo.date === dateStr).length
}

// 获取某天的已完成任务数量
const getCompletedTodoCountForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]
  return todos.value.filter(todo => todo.date === dateStr && todo.completed).length
}

// 添加新任务
const addTodo = () => {
  if (newTodo.value.title && selectedDate.value) {
    const todo: TodoItem = {
      id: Date.now().toString(),
      date: selectedDate.value,
      title: newTodo.value.title,
      description: newTodo.value.description,
      completed: false
    }
    todos.value.push(todo)
    resetNewTodo()
    showAddModal.value = false
  }
}

// 重置新任务表单
const resetNewTodo = () => {
  newTodo.value = {
    title: '',
    description: ''
  }
}

// 切换任务完成状态
const toggleTodoCompleted = (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 删除任务
const deleteTodo = (id: string) => {
  todos.value = todos.value.filter(t => t.id !== id)
}

// 获取选中日期的任务
const selectedDateTodos = computed(() => {
  if (!selectedDate.value) return []
  return todos.value.filter(todo => todo.date === selectedDate.value)
})

// 格式化日期为 YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// 初始化示例数据
onMounted(() => {
  const today = formatDate(new Date())
  todos.value = [
    {
      id: '1',
      date: today!,
      title: '完成项目总结',
      description: '整理本周工作内容，准备周报',
      completed: false
    },
    {
      id: '2',
      date: today!,
      title: '健身',
      description: '去健身房锻炼1小时',
      completed: false
    }
  ]
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        日历任务管理
      </h1>
    </div>

    <div class="calendar-todo-container">
    <!-- 日历部分 -->
    <div class="calendar-section">
      <div class="calendar-header">
        <button class="btn btn-secondary" @click="prevMonth">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="month-title">{{ currentMonthName }}</h2>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="goToToday">今天</button>
          <button class="btn btn-secondary" @click="nextMonth">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'selected': selectedDate === formatDate(day.date),
            'has-todos': getTodoCountForDate(day.date) > 0
          }"
          @click="selectDate(day.date)"
        >
          <div class="day-number">{{ day.day }}</div>
          <div v-if="getTodoCountForDate(day.date) > 0" class="todo-indicator">
            <span class="todo-count">{{ getCompletedTodoCountForDate(day.date) }}/{{ getTodoCountForDate(day.date) }}</span>
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
        <button v-if="selectedDate" class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div class="todo-list">
        <div v-if="selectedDateTodos.length === 0" class="empty-state">
          <p>{{ selectedDate ? `暂无 ${selectedDate} 的任务` : '请选择日期添加任务' }}</p>
        </div>
        <div v-else class="todo-items">
          <div 
            v-for="todo in selectedDateTodos" 
            :key="todo.id"
            class="todo-item"
            :class="{ 'completed': todo.completed }"
          >
            <div class="todo-checkbox">
              <input 
                type="checkbox" 
                :checked="todo.completed"
                @change="toggleTodoCompleted(todo.id)"
              />
            </div>
            <div class="todo-content">
              <h3 class="todo-title">{{ todo.title }}</h3>
              <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
            </div>
            <button class="btn btn-danger btn-sm" @click="deleteTodo(todo.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加任务模态框 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">添加任务 - {{ selectedDate }}</h2>
          <button class="modal-close" @click="showAddModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addTodo">
            <div class="form-group">
              <label for="todo-title" class="form-label">任务标题</label>
              <input
                id="todo-title"
                v-model="newTodo.title"
                type="text"
                class="form-input"
                placeholder="请输入任务标题"
                required
              />
            </div>
            <div class="form-group">
              <label for="todo-description" class="form-label">任务描述</label>
              <textarea
                id="todo-description"
                v-model="newTodo.description"
                class="form-input"
                placeholder="请输入任务描述"
                rows="3"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddModal = false">
                取消
              </button>
              <button type="submit" class="btn btn-primary">
                添加任务
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
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
  margin-top: var(--spacing-xs);
  font-size: 10px;
  background-color: var(--color-primary);
  color: white;
  padding: 1px 4px;
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px var(--color-shadow);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
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

.modal-footer {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
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