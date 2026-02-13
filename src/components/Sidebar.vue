<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

// 定义 props
const props = defineProps<{
  isCollapsed?: boolean
}>()

// 定义 emits
const emit = defineEmits<{
  (e: 'toggleCollapse'): void
}>()

const router = useRouter()
const currentRoute = ref(router.currentRoute.value.path)
const { theme, toggleTheme } = useTheme()

// 导航栏收缩状态
const isSidebarCollapsed = ref(props.isCollapsed || false)

// 导航项数组
const navItems = [
  {
    path: '/workbench',
    label: '工作台',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  {
    path: '/calendar',
    label: '日历任务',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    path: '/file-upload',
    label: '文件上传',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
  },
  {
    path: '/virtual-table',
    label: '虚拟表格',
    icon: 'M3 10h18M3 14h18M12 3v18'
  },
  {
    path: '/profile',
    label: '我的',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }
]

// 切换导航栏收缩状态
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  emit('toggleCollapse')
}

router.afterEach((to) => {
  currentRoute.value = to.path
})
</script>

<template>
  <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
    <div class="sidebar-header">
      <h1 class="app-title" v-if="!isSidebarCollapsed">InterviewFlow</h1>
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'">
          <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </div>
    <button class="sidebar-toggle" @click="toggleSidebar" :title="isSidebarCollapsed ? '展开导航栏' : '收缩导航栏'">
      <span>{{ isSidebarCollapsed ? '>' : '<' }}</span>
    </button>
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="(item, index) in navItems" :key="index">
          <router-link 
            :to="item.path" 
            class="nav-item"
            :class="{ active: currentRoute === item.path }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 16rem;
  background-color: var(--color-bg-primary);
  box-shadow: 0 4px 6px var(--color-shadow);
  transition: width 0.3s ease, box-shadow 0.3s ease;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 4rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: padding 0.3s ease;
}

.sidebar.collapsed .sidebar-header {
  padding: var(--spacing-lg) var(--spacing-md);
  justify-content: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar.collapsed .header-actions {
  opacity: 1;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-bottom: 0;
}

.sidebar-nav {
  padding: var(--spacing-md);
  flex: 1;
  transition: padding 0.3s ease;
}

.sidebar.collapsed .sidebar-nav {
  padding: var(--spacing-sm);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.nav-item.active {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  font-weight: 500;
}

.nav-item span {
  overflow: hidden;
  flex-shrink: 1;
  min-width: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar.collapsed .nav-item span {
  opacity: 0;
  transform: scale(0.8);
  width: 0;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  gap: 0;
  padding: var(--spacing-md) var(--spacing-sm);
}

.sidebar.collapsed .nav-item svg {
  font-size: 1.25rem;
}

.sidebar.collapsed .sidebar-footer {
  padding: var(--spacing-lg) var(--spacing-md);
}

.footer-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar-toggle {
  position: absolute;
  right: -0.75rem;
  font-size: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  border: none;
  background-color: var(--color-bg-primary);
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: 20%;
  flex-shrink: 0;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  box-shadow: 0 2px 4px var(--color-shadow);
  z-index: 101;
}

.sidebar-toggle:hover {
  background-color: var(--color-bg-tertiary);
}

.sidebar.collapsed .sidebar-toggle {
  right: -0.75rem;
  background-color: var(--color-bg-primary);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
