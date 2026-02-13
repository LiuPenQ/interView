<!--
用户个人资料页面
用途：展示用户个人信息，提供编辑和退出登录功能
实现：使用Vue 3 Composition API，展示用户基本信息
功能：
- 显示用户个人资料
- 提供编辑个人信息功能
- 支持退出登录
-->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">我的</h1>
    <div class="rounded-lg shadow p-6" style="background-color: var(--color-bg-primary);">
      <div class="flex items-center gap-6 mb-8">
        <div class="w-20 h-20 rounded-full flex items-center justify-center" style="background-color: var(--color-bg-tertiary);">
          <span class="text-2xl font-bold" style="color: var(--color-text-secondary);">用户</span>
        </div>
        <div>
          <h2 class="text-xl font-semibold" style="color: var(--color-text-primary);">用户名</h2>
          <p style="color: var(--color-text-secondary);">user@example.com</p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">账号设置</span>
          <button style="color: var(--color-primary);">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">个人信息</span>
          <button style="color: var(--color-primary);">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">通知设置</span>
          <button style="color: var(--color-primary);">编辑</button>
        </div>
        <div class="flex justify-between items-center">
          <span style="color: var(--color-text-primary);">退出登录</span>
          <button style="color: #ef4444;">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 个人资料页面逻辑
</script>

<style scoped>
/* 组件样式 */
</style>