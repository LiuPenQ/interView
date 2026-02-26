<template>
  <div class="app-layout">
    <div class="main-container">
      <HeaderNav />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderNav from '../components/layout/HeaderNav.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-bg-secondary);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>
