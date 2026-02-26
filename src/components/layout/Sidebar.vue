<template>
  <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <span v-if="!isSidebarCollapsed" class="logo-text">面试助手</span>
        <span v-else class="logo-text">面</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li>
          <router-link to="/" class="nav-item" :class="{ 'active': isActive('/') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">首页</span>
          </router-link>
        </li>

        <li>
          <router-link to="/workbench" class="nav-item" :class="{ 'active': isActive('/workbench') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">工作台</span>
          </router-link>
        </li>

        <li>
          <router-link to="/calendar" class="nav-item" :class="{ 'active': isActive('/calendar') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">日历看板</span>
          </router-link>
        </li>

        <li>
          <router-link to="/word" class="nav-item" :class="{ 'active': isActive('/word') }">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">八股文</span>
          </router-link>
        </li>

        <li class="nav-group">
          <div class="nav-group-header" @click="toggleComponentsGroup">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span v-if="!isSidebarCollapsed" class="nav-label">常用组件</span>
            <svg v-if="!isSidebarCollapsed" xmlns="http://www.w3.org/2000/svg" class="nav-arrow"
              :class="{ 'rotated': showComponents }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <ul v-if="showComponents && !isSidebarCollapsed" class="nav-submenu">
            <li>
              <router-link to="/file-upload" class="nav-subitem" :class="{ 'active': isActive('/file-upload') }">
                <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon-sm" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                文件上传
              </router-link>
            </li>
            <li>
              <router-link to="/tree-view" class="nav-subitem" :class="{ 'active': isActive('/tree-view') }">
                <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon-sm" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                人员树
              </router-link>
            </li>
            <li>
              <router-link to="/virtual-table" class="nav-subitem" :class="{ 'active': isActive('/virtual-table') }">
                <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon-sm" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M12 3v18" />
                </svg>
                虚拟表格
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <button class="sidebar-toggle" @click="toggleSidebar" :title="isSidebarCollapsed ? '展开导航栏' : '收缩导航栏'">
      <span>{{ isSidebarCollapsed ? '>' : '<' }}</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// @ts-ignore
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useStore()

const props = defineProps<{
  isCollapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleCollapse'): void
}>()

const isSidebarCollapsed = computed(() => props.isCollapsed || false)
const showComponents = ref(true)

const user = computed(() => {
  return store.getters['user/currentUser']
})

const isActive = (path: string) => {
  return route.path === path
}

const toggleSidebar = () => {
  emit('toggleCollapse')
}

const toggleComponentsGroup = () => {
  showComponents.value = !showComponents.value
}

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    await store.dispatch('user/logout')
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
.sidebar {
  width: 16rem;
  height: 100vh;
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
}

.sidebar.collapsed {
  width: 4rem;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-primary);
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md) 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item,
.nav-group-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  text-decoration: none;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  margin: 0 var(--spacing-sm);
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item:hover,
.nav-group-header:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.nav-arrow {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.nav-arrow.rotated {
  transform: rotate(90deg);
}

.nav-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 4px;
}

.nav-subitem {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  padding-left: 3.5rem;
  text-decoration: none;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  margin: 0 var(--spacing-sm);
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.875rem;
}

.nav-subitem:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.nav-subitem.active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.nav-icon-sm {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 10;
}

.sidebar-toggle:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
