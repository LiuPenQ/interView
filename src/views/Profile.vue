<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">我的</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center gap-6 mb-8">
        <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <span class="text-2xl font-bold text-gray-500">用户</span>
        </div>
        <div>
          <h2 class="text-xl font-semibold">用户名</h2>
          <p class="text-gray-600">user@example.com</p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-4 border-b">
          <span class="text-gray-700">账号设置</span>
          <button class="text-blue-600">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4 border-b">
          <span class="text-gray-700">个人信息</span>
          <button class="text-blue-600">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4 border-b">
          <span class="text-gray-700">通知设置</span>
          <button class="text-blue-600">编辑</button>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-700">退出登录</span>
          <button class="text-red-600">退出</button>
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