<!--
功能组件目录组件
用途：左侧目录导航，显示功能组件的子菜单
-->
<template>
  <aside class="function-menu">
    <div class="menu-header">
      <h3 class="menu-title">目录</h3>
    </div>
    <nav class="menu-content">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.path" class="menu-item">
          <router-link
            :to="item.path"
            class="menu-link"
            :class="{ active: currentRoute === item.path }"
          >
            <span class="menu-icon" v-if="item.icon" v-html="item.icon"></span>
            <span class="menu-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentRoute = ref(router.currentRoute.value.path)

// 功能组件菜单项
const menuItems = [
  {
    path: '/file-upload',
    label: '文件上传',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>'
  },
  {
    path: '/tree-view',
    label: '人员树',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>'
  },
  {
    path: '/virtual-table',
    label: '虚拟表格',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>'
  },
  {
    path: '/word',
    label: '八股文',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
  }
]

router.afterEach((to) => {
  currentRoute.value = to.path
})
</script>

<style scoped>
.function-menu {
  width: 240px;
  background-color: var(--color-bg-primary);
  border-right: 1px solid var(--color-border);
  height: calc(100vh - 60px);
  position: fixed;
  left: 0;
  top: 60px;
  overflow-y: auto;
  z-index: 50;
}

.menu-header {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.menu-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.menu-content {
  padding: 12px 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  margin: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.menu-link:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.menu-link.active {
  background-color: var(--color-bg-tertiary);
  color: var(--color-primary);
  border-right: 3px solid var(--color-primary);
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.menu-icon svg {
  width: 100%;
  height: 100%;
}

.menu-label {
  white-space: nowrap;
}

/* 滚动条样式 */
.function-menu::-webkit-scrollbar {
  width: 4px;
}

.function-menu::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.function-menu::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.function-menu::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>
