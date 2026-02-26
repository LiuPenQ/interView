<!--
登录页面组件
功能：实现用户登录、注册功能，支持JWT token认证
-->
<template>
  <div class="login-container">
    <div class="login-bg-pattern"></div>
    <div class="login-content">
      <div class="login-card">


        <h2 class="login-title">{{ isLogin ? '欢迎回来！' : '创建账号' }}</h2>
        <p class="login-subtitle">{{ isLogin ? '登录后继续你的面试流程' : '注册账号，开始你的求职之旅' }}</p>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="16" height="16" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input type="text" id="username" v-model="formData.username" required placeholder="输入你的用户名"
                class="form-input">
            </div>
          </div>

          <div v-if="!isLogin" class="form-group">
            <label for="email" class="form-label">邮箱</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="16" height="16" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input type="email" id="email" v-model="formData.email" required placeholder="输入你的邮箱" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="16" height="16" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input type="password" id="password" v-model="formData.password" required placeholder="输入你的密码"
                class="form-input">
            </div>
          </div>

          <button type="submit" class="submit-btn">
            <span>{{ isLogin ? '登录' : '注册' }}</span>
          </button>
        </form>

        <div class="toggle-link">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <a @click="isLogin = !isLogin" class="toggle-btn">{{ isLogin ? '立即注册' : '立即登录' }}</a>
        </div>

        <div class="login-footer">
          <p class="footer-text">© 2026 Interview Flow</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// @ts-ignore
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const router = useRouter();
const store = useStore();
const isLogin = ref(true);
const formData = reactive({
  username: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // 登录
      const user = await store.dispatch('user/login', {
        email: formData.username, // 使用username作为email，因为Vuex的login action期望email参数
        password: formData.password
      });

      ElMessage.success('登录成功');

      // 跳转到工作台
      router.push('/workbench');
    } else {
      // 注册
      const user = await store.dispatch('user/register', {
        name: formData.username,
        email: formData.email,
        password: formData.password
      });

      ElMessage.success('注册成功');

      // 注册成功后切换到登录
      isLogin.value = true;
      formData.email = '';
    }
  } catch (error: any) {
    console.error('请求错误:', error);
    ElMessage.error(error.message || '网络错误，请稍后重试');
  }
};
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  overflow: hidden;
}

.login-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=');
  pointer-events: none;
}

.login-content {
  position: relative;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* transform: translateY(-5%); */
}


@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.brand-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.4;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: 1rem;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.toggle-link {
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-btn:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.login-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.footer-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  text-align: center;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    gap: 2rem;
  }

  .login-card {
    margin-left: 0;
    transform: none;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .login-content {
    padding: 2rem;
  }

  .login-card {
    padding: 2rem;
  }
}
</style>