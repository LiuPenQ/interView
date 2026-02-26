<!--
虚拟表格性能测试页面
用途：模拟后端一次性返回万条数据，前端使用虚拟滚动技术优化页面卡顿问题
实现：使用Vue 3 Composition API，通过计算滚动位置和偏移量，只渲染可视区域内的数据
功能：
- 模拟后端返回10000条用户数据
- 实现虚拟滚动，优化渲染性能
- 实时显示性能指标
- 支持重新加载数据测试
-->
<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-6">虚拟表格性能测试</h1>
    <div class="mb-4">
      <button class="btn primary" @click="fetchData" :disabled="loading">
        {{ loading ? '加载中...' : '重新加载数据' }}
      </button>
    </div>
    <!-- 性能指标 -->
    <div class="performance-metrics mb-4">
      <h2 class="text-lg font-semibold mb-2">性能指标</h2>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">总数据量:</span>
          <span class="metric-value">{{ totalItems }} 条</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">可视区域行数:</span>
          <span class="metric-value">{{ visibleCount }} 行</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">当前渲染行数:</span>
          <span class="metric-value">{{ visibleItems.length }} 行</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">起始索引:</span>
          <span class="metric-value">{{ startIndex }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">结束索引:</span>
          <span class="metric-value">{{ endIndex }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">滚动位置:</span>
          <span class="metric-value">{{ scrollTop }}px</span>
        </div>
      </div>
    </div>
    <!-- 虚拟表格 -->
    <div ref="containerRef" class="virtual-table-container" :style="{ height: `${tableHeight}px` }"
      @scroll="handleScroll">
      <!-- 表格头部 -->
      <div class="table-header">
        <div class="header-cell" style="width: 80px;">ID</div>
        <div class="header-cell" style="width: 120px;">姓名</div>
        <div class="header-cell" style="width: 200px;">邮箱</div>
        <div class="header-cell" style="width: 80px;">年龄</div>
        <div class="header-cell" style="width: 200px;">地址</div>
        <div class="header-cell" style="width: 150px;">电话</div>
        <div class="header-cell" style="width: 150px;">公司</div>
        <div class="header-cell" style="width: 150px;">职位</div>
        <div class="header-cell" style="width: 120px;">薪资</div>
        <div class="header-cell" style="width: 120px;">入职日期</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body" :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <!-- 可见数据区域 -->
        <div class="visible-data"
          :style="{ transform: `translateY(${offsetTop}px)`, position: 'absolute', top: 0, left: 0, right: 0 }">
          <div v-for="item in visibleItems" :key="item.id" class="table-row" :style="{ height: `${rowHeight}px` }">
            <div class="table-cell" style="width: 80px;">{{ item.id }}</div>
            <div class="table-cell" style="width: 120px;">{{ item.name }}</div>
            <div class="table-cell" style="width: 200px;">{{ item.email }}</div>
            <div class="table-cell" style="width: 80px;">{{ item.age }}</div>
            <div class="table-cell" style="width: 200px;">{{ item.address }}</div>
            <div class="table-cell" style="width: 150px;">{{ item.phone }}</div>
            <div class="table-cell" style="width: 150px;">{{ item.company }}</div>
            <div class="table-cell" style="width: 150px;">{{ item.position }}</div>
            <div class="table-cell" style="width: 120px;">¥{{ item.salary.toLocaleString() }}</div>
            <div class="table-cell" style="width: 120px;">{{ item.joinDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// 模拟数据类型
interface User {
  id: number
  name: string
  email: string
  age: number
  address: string
  phone: string
  company: string
  position: string
  salary: number
  joinDate: string
}

// 表格配置
const tableHeight = ref(600)
const rowHeight = ref(50)
const visibleCount = computed(() => Math.ceil(tableHeight.value / rowHeight.value) + 2)

// 数据状态
const totalItems = ref(10000)
const items = ref<User[]>([])
const loading = ref(false)
const startIndex = ref(0)
const endIndex = computed(() => Math.min(startIndex.value + visibleCount.value, totalItems.value))
const visibleItems = computed(() => items.value.slice(startIndex.value, endIndex.value))
const scrollTop = ref(0)

// 生成模拟数据
const generateMockData = (count: number): User[] => {
  const data: User[] = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: Math.floor(Math.random() * 40) + 20,
      address: `北京市朝阳区${Math.floor(Math.random() * 1000)}号`,
      phone: `138${Math.floor(Math.random() * 100000000)}`,
      company: `公司${Math.floor(Math.random() * 100)}`,
      position: `职位${Math.floor(Math.random() * 50)}`,
      salary: Math.floor(Math.random() * 20000) + 10000,
      joinDate: `${2020 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    })
  }
  return data
}

// 模拟后端请求
const fetchData = async () => {
  loading.value = true
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  items.value = generateMockData(totalItems.value)
  loading.value = false
}

// 处理滚动事件
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = Math.floor(target.scrollTop)
  startIndex.value = Math.floor(scrollTop.value / rowHeight.value)
}

// 计算偏移量
const offsetTop = computed(() => startIndex.value * rowHeight.value)

// 计算总高度
const totalHeight = computed(() => totalItems.value * rowHeight.value)

// 初始化
onMounted(() => {
  fetchData()
})

// 监听数据变化
watch(items, () => {
  startIndex.value = 0
  scrollTop.value = 0
})
</script>
<style scoped>
.virtual-table-container {
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.table-header {
  display: flex;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-cell {
  padding: 0 12px;
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--color-text-primary);
  height: 50px;
  border-right: 1px solid var(--color-border);
}

.table-body {
  position: relative;
  width: 100%;
}

.visible-data {
  width: 100%;
}

.table-row {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background-color: var(--color-bg-secondary);
}

.table-cell {
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--color-border);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-cell:last-child {
  border-right: none;
}

.performance-metrics {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.metric-label {
  color: var(--color-text-secondary);
}

.metric-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 滚动条样式 */
.virtual-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-table-container::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.virtual-table-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

.virtual-table-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>