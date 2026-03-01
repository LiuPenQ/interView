<template>
  <header class="header-nav">
    <div class="header-left">
      <div class="logo">
        <!-- <span class="logo-text">面试助手</span> -->
      </div>

      <!-- 桌面端导航 -->
      <nav class="main-nav desktop-nav">
        <template v-for="navItem in navItems" :key="navItem.key">
          <template v-if="!navItem.children">
            <router-link :to="navItem.path" class="nav-item" :class="{ 'active': isActive(navItem) }">
              <component v-if="navItem.icon" :is="navItem.icon" class="nav-icon"></component>
              <span class="nav-label">{{ navItem.label }}</span>
            </router-link>
          </template>

          <template v-else>
            <div class="nav-dropdown" @mouseenter="showDropdown(navItem.key)" @mouseleave="hideDropdown(navItem.key)">
              <div class="nav-item dropdown-trigger" :class="{ 'active': isActive(navItem) }">
                <component v-if="navItem.icon" :is="navItem.icon" class="nav-icon"></component>
                <span class="nav-label">{{ navItem.label }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="nav-arrow"
                  :class="{ 'rotated': showDropdowns[navItem.key] }" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div v-if="showDropdowns[navItem.key]" class="dropdown-menu">
                <router-link v-for="child in navItem.children" :key="child.key" :to="child.path" class="dropdown-item"
                  :class="{ 'active': isActive(child) }">
                  <component v-if="child.icon" :is="child.icon" class="nav-icon-sm"></component>
                  {{ child.label }}
                </router-link>
              </div>
            </div>
          </template>
        </template>
      </nav>
    </div>

    <div class="header-right">
      <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'">
        <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      <div class="user-menu" @mouseenter="showUserMenuEvent()" @mouseleave="hideUserMenu()">
        <button class="user-avatar-btn">
          <div class="avatar">
            <span class="avatar-text">{{ (user?.username || 'U').charAt(0).toUpperCase() }}</span>
          </div>
        </button>

        <div v-if="showUserMenu" class="user-dropdown">
          <div class="dropdown-content">
            <div class="user-info-section">
              <div class="dropdown-avatar">
                <span class="dropdown-avatar-text">{{ (user?.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-details">
                <div class="user-name">{{ user?.username || '用户' }}</div>
                <div class="user-email">{{ user?.email || 'user@example.com' }}</div>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <button class="dropdown-item" @click="goToProfile">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              个人资料
            </button>

            <button class="dropdown-item" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端汉堡菜单按钮 -->
      <button class="hamburger-btn" @click="toggleMobileMenu" :class="{ 'active': showMobileMenu }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- 移动端导航抽屉 -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="closeMobileMenu">
          <div class="mobile-menu-drawer" @click.stop>
            <div class="mobile-menu-header">
              <span class="mobile-menu-title">导航菜单</span>
              <button class="mobile-close-btn" @click="closeMobileMenu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav class="mobile-nav">
              <template v-for="navItem in navItems" :key="navItem.key">
                <template v-if="!navItem.children">
                  <router-link :to="navItem.path" class="mobile-nav-item" :class="{ 'active': isActive(navItem) }"
                    @click="closeMobileMenu">
                    <component v-if="navItem.icon" :is="navItem.icon" class="nav-icon"></component>
                    <span class="nav-label">{{ navItem.label }}</span>
                  </router-link>
                </template>

                <template v-else>
                  <div class="mobile-nav-group">
                    <div class="mobile-nav-item mobile-dropdown-trigger" :class="{ 'active': isActive(navItem) }"
                      @click="toggleMobileDropdown(navItem.key)">
                      <component v-if="navItem.icon" :is="navItem.icon" class="nav-icon"></component>
                      <span class="nav-label">{{ navItem.label }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="nav-arrow"
                        :class="{ 'rotated': mobileDropdowns[navItem.key] }" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <Transition name="expand">
                      <div v-if="mobileDropdowns[navItem.key]" class="mobile-dropdown-content">
                        <router-link v-for="child in navItem.children" :key="child.key" :to="child.path"
                          class="mobile-nav-item mobile-child-item" :class="{ 'active': isActive(child) }"
                          @click="closeMobileMenu">
                          <component v-if="child.icon" :is="child.icon" class="nav-icon-sm"></component>
                          <span class="nav-label">{{ child.label }}</span>
                        </router-link>
                      </div>
                    </Transition>
                  </div>
                </template>
              </template>
            </nav>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, reactive, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// @ts-ignore
import { useStore } from 'vuex'
import { useTheme } from '../../composables/useTheme'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { theme, toggleTheme } = useTheme()

const user = computed(() => {
  return store.getters['user/currentUser']
})

const showDropdowns = reactive<Record<string, boolean>>({})
const hideTimers = reactive<Record<string, number>>({})
const showUserMenu = ref(false)
let userMenuHideTimer: number | null = null

const showMobileMenu = ref(false)
const mobileDropdowns = reactive<Record<string, boolean>>({})

const DROP_DELAY = 200

const HomeIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    })
  ])
}

const WorkbenchIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    })
  ])
}

const CalendarIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    })
  ])
}

const ReviewIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    })
  ])
}

const ComponentsIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    })
  ])
}

const FileUploadIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
    })
  ])
}

const TreeViewIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    })
  ])
}

const VirtualTableIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 10h18M3 14h18M12 3v18'
    })
  ])
}

const CodingIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    })
  ])
}

const navItems = [
  {
    key: 'home',
    label: '首页',
    path: '/home',
    activePaths: ['/home'],
    icon: HomeIcon
  },
  {
    key: 'workbench',
    label: '工作台',
    path: '/workbench',
    activePaths: ['/workbench'],
    icon: WorkbenchIcon
  },
  {
    key: 'calendar',
    label: '日历看板',
    path: '/calendar',
    activePaths: ['/calendar'],
    icon: CalendarIcon
  },
  {
    key: 'review',
    label: '复习',
    activePaths: ['/word', '/word/theory', '/word/coding'],
    icon: ReviewIcon,
    children: [
      {
        key: 'theory',
        label: '八股文',
        path: '/word/theory',
        activePaths: ['/word/theory'],
        icon: ReviewIcon
      },
      {
        key: 'coding',
        label: '编程题',
        path: '/word/coding',
        activePaths: ['/word/coding'],
        icon: CodingIcon
      }
    ]
  },
  {
    key: 'components',
    label: '常用组件',
    activePaths: ['/file-upload', '/tree-view', '/virtual-table'],
    icon: ComponentsIcon,
    children: [
      {
        key: 'file-upload',
        label: '文件上传',
        path: '/file-upload',
        activePaths: ['/file-upload'],
        icon: FileUploadIcon
      },
      {
        key: 'tree-view',
        label: '人员树',
        path: '/tree-view',
        activePaths: ['/tree-view'],
        icon: TreeViewIcon
      },
      {
        key: 'virtual-table',
        label: '虚拟表格',
        path: '/virtual-table',
        activePaths: ['/virtual-table'],
        icon: VirtualTableIcon
      }
    ]
  }
]

const isActive = (navItem: any) => {
  return navItem.activePaths.some((path: string) => route.path === path || route.path.startsWith(path))
}

const showDropdown = (key: string) => {
  if (hideTimers[key]) {
    clearTimeout(hideTimers[key])
    delete hideTimers[key]
  }
  showDropdowns[key] = true
}

const hideDropdown = (key: string) => {
  hideTimers[key] = window.setTimeout(() => {
    showDropdowns[key] = false
    delete hideTimers[key]
  }, DROP_DELAY)
}

const showUserMenuEvent = () => {
  if (userMenuHideTimer) {
    clearTimeout(userMenuHideTimer)
  }
  userMenuHideTimer = window.setTimeout(() => {
    showUserMenu.value = true
  }, DROP_DELAY)
}

const hideUserMenu = () => {
  if (userMenuHideTimer) {
    clearTimeout(userMenuHideTimer)
  }
  userMenuHideTimer = window.setTimeout(() => {
    showUserMenu.value = false
  }, DROP_DELAY)
}

const goToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
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
  showUserMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}

const toggleMobileDropdown = (key: string) => {
  mobileDropdowns[key] = !mobileDropdowns[key]
}
</script>

<style scoped>
.header-nav {
  height: 64px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-right: var(--spacing-xl);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-primary);
  white-space: nowrap;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-item,
.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.nav-item:hover,
.dropdown-trigger:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.nav-item.active,
.dropdown-trigger.active {
  background: rgba(41, 94, 172, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.nav-icon {
  width: 1.125rem;
  height: 1.125rem;
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
  transition: transform 0.2s ease;
}

.nav-arrow.rotated {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  margin-top: 4px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px var(--color-shadow);
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.dropdown-item.active {
  background: rgba(41, 94, 172, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.nav-icon-sm {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.user-menu {
  position: relative;
}

.user-avatar-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.user-avatar-btn:hover {
  transform: scale(1.05);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(41, 94, 172, 0.2);
}

.avatar-text {
  font-size: 1.125rem;
  font-weight: bold;
  color: white;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px var(--color-shadow);
  border: 1px solid var(--color-border);
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

.dropdown-content {
  padding: var(--spacing-sm);
}

.user-info-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-avatar-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-sm) 0;
}

.user-dropdown .dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  text-align: left;
  transition: all 0.2s ease;
}

.user-dropdown .dropdown-item:hover {
  background: var(--color-bg-secondary);
}

.user-dropdown .dropdown-item:last-child {
  color: var(--color-danger);
}

.user-dropdown .dropdown-item:last-child:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 汉堡菜单按钮 */
.hamburger-btn {
  display: none;
  width: 40px;
  height: 40px;
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.hamburger-btn:hover {
  background: var(--color-bg-tertiary);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* 移动端菜单遮罩 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 移动端菜单抽屉 */
.mobile-menu-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  max-width: 80vw;
  height: 100vh;
  background: var(--color-bg-primary);
  box-shadow: -4px 0 16px var(--color-shadow);
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.mobile-menu-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.mobile-close-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.mobile-close-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.mobile-close-btn svg {
  width: 20px;
  height: 20px;
}

/* 移动端导航 */
.mobile-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  text-decoration: none;
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 4px;
}

.mobile-nav-item:hover {
  background: var(--color-bg-secondary);
}

.mobile-nav-item.active {
  background: rgba(41, 94, 172, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.mobile-dropdown-trigger .nav-arrow {
  transition: transform 0.2s ease;
}

.mobile-dropdown-trigger .nav-arrow.rotated {
  transform: rotate(180deg);
}

.mobile-nav-group {
  margin-bottom: 4px;
}

.mobile-dropdown-content {
  padding-left: var(--spacing-lg);
  overflow: hidden;
}

.mobile-child-item {
  font-size: 0.875rem;
  padding: var(--spacing-sm) var(--spacing-md);
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active .mobile-menu-drawer,
.mobile-menu-leave-active .mobile-menu-drawer {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu-drawer,
.mobile-menu-leave-to .mobile-menu-drawer {
  transform: translateX(100%);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* 响应式媒体查询 */
@media (max-width: 768px) {
  .header-nav {
    padding: 0 var(--spacing-md);
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-btn {
    display: flex;
  }

  .logo {
    margin-right: var(--spacing-sm);
  }

  .header-right {
    gap: var(--spacing-sm);
  }

  .user-menu .user-dropdown {
    display: none;
  }
}

@media (min-width: 769px) {
  .hamburger-btn {
    display: none;
  }
}
</style>
