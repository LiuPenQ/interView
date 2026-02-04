<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'

// 导航栏收缩状态
const isSidebarCollapsed = ref(false)

// 切换导航栏收缩状态
const handleToggleCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<template>
  <div class="app-layout">
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle-collapse="handleToggleCollapse" />
    <main class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: var(--color-bg-secondary);
}

.main-content {
  flex: 1;
  overflow: auto;
  margin-left: 16rem;
  transition: margin-left 0.3s ease;
  height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 4rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>
