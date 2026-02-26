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
          <span class="text-2xl font-bold" style="color: var(--color-text-secondary);">{{ (user?.username || 'U').charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <h2 class="text-xl font-semibold" style="color: var(--color-text-primary);">{{ user?.username || '用户名' }}</h2>
          <p style="color: var(--color-text-secondary);">{{ user?.email || 'user@example.com' }}</p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">账号设置</span>
          <button style="color: var(--color-primary);" @click="openEditModal('account')">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">个人信息</span>
          <button style="color: var(--color-primary);" @click="openEditModal('profile')">编辑</button>
        </div>
        <div class="flex justify-between items-center pb-4" style="border-bottom: 1px solid var(--color-border);">
          <span style="color: var(--color-text-primary);">通知设置</span>
          <button style="color: var(--color-primary);" @click="openEditModal('notification')">编辑</button>
        </div>
        <div class="flex justify-between items-center">
          <span style="color: var(--color-text-primary);">退出登录</span>
          <button style="color: #ef4444;" @click="handleLogout">退出</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑模态框 -->
    <div v-if="isModalOpen" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50;">
      <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding: 24px; width: 100%; max-width: 400px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">{{ modalTitle }}</h3>
        <form @submit.prevent="handleSave">
          <div style="margin-bottom: 16px;" v-if="activeModal === 'account' || activeModal === 'profile'">
            <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">用户名</label>
            <input 
              type="text" 
              v-model="editForm.username" 
              style="width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px;"
              placeholder="输入用户名"
            >
          </div>
          <div style="margin-bottom: 16px;" v-if="activeModal === 'profile'">
            <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">邮箱</label>
            <input 
              type="email" 
              v-model="editForm.email" 
              style="width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px;"
              placeholder="输入邮箱"
            >
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" style="padding: 8px 16px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: white; cursor: pointer;" @click="closeModal">取消</button>
            <button type="submit" style="padding: 8px 16px; border: 1px solid var(--color-primary); border-radius: 4px; background-color: var(--color-primary); color: white; cursor: pointer;">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useStore()

// 从Vuex获取用户信息
const user = computed(() => {
  return store.getters['user/currentUser']
})

// 编辑模态框状态
const isModalOpen = ref(false)
const activeModal = ref('')
const modalTitle = computed(() => {
  switch (activeModal.value) {
    case 'account': return '编辑账号设置'
    case 'profile': return '编辑个人信息'
    case 'notification': return '编辑通知设置'
    default: return '编辑设置'
  }
})

// 编辑表单数据
const editForm = reactive({
  username: '',
  email: ''
})

// 打开编辑模态框
const openEditModal = (modalType: string) => {
  activeModal.value = modalType
  // 填充表单数据
  if (user.value) {
    editForm.username = user.value.username || ''
    editForm.email = user.value.email || ''
  }
  isModalOpen.value = true
}

// 关闭编辑模态框
const closeModal = () => {
  isModalOpen.value = false
  // 重置表单
  editForm.username = ''
  editForm.email = ''
}

// 保存编辑内容
const handleSave = async () => {
  try {
    if (activeModal.value === 'account' || activeModal.value === 'profile') {
      await store.dispatch('user/updateUserInfo', editForm)
      ElMessage.success('更新成功')
    }
    closeModal()
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 退出登录
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
/* 组件样式 */
.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary:hover {
  background-color: var(--color-primary-hover);
}
</style>