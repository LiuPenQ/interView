<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="avatar-section">
          <div class="avatar">
            <span class="avatar-text">{{ (user?.username || 'U').charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <h1 class="greeting">你好，我是 <span class="highlight">{{ user?.username || '开发者' }}</span></h1>
        <p class="subtitle">全栈开发工程师 | Vue 3 爱好者</p>
        <p class="description">
          持续学习新技术，追求卓越的用户体验和代码质量。热爱前端开发，致力于创建美观、高效且可维护的 Web 应用。
        </p>
        <div class="action-buttons">
          <button class="btn btn-primary" @click="goToWorkbench">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            开始使用
          </button>
          <button class="btn btn-secondary" @click="goToProfile">
            个人资料
          </button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="code-card">
          <div class="code-header">
            <div class="code-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="code-title">developer.ts</span>
          </div>
          <div class="code-content">
            <pre><code><span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">'{{ user?.username || 'Developer' }}'</span>,
  <span class="property">role</span>: <span class="string">'Full-stack Engineer'</span>,
  <span class="property">skills</span>: [
    <span class="string">'Vue 3'</span>,
    <span class="string">'TypeScript'</span>,
    <span class="string">'Node.js'</span>,
    <span class="string">'Element Plus'</span>
  ],
  <span class="property">motto</span>: <span class="string">'Code changes the world'</span>
};</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="skills-section">
      <h2 class="section-title">技术栈</h2>
      <div class="skills-grid">
        <div class="skill-card">
          <div class="skill-icon">⚡</div>
          <h3 class="skill-name">Vue 3</h3>
          <p class="skill-desc">Composition API + 响应式原理</p>
        </div>
        <div class="skill-card">
          <div class="skill-icon">📘</div>
          <h3 class="skill-name">TypeScript</h3>
          <p class="skill-desc">类型安全 + 类型体操</p>
        </div>
        <div class="skill-card">
          <div class="skill-icon">🎨</div>
          <h3 class="skill-name">Element Plus</h3>
          <p class="skill-desc">企业级 UI 组件库</p>
        </div>
        <div class="skill-card">
          <div class="skill-icon">🚀</div>
          <h3 class="skill-name">Vite</h3>
          <p class="skill-desc">极速开发 + 热更新</p>
        </div>
        <div class="skill-card">
          <div class="skill-icon">💾</div>
          <h3 class="skill-name">Node.js</h3>
          <p class="skill-desc">后端服务 + API 开发</p>
        </div>
        <div class="skill-card">
          <div class="skill-icon">🗄️</div>
          <h3 class="skill-name">MySQL</h3>
          <p class="skill-desc">数据库 + 数据持久化</p>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">功能特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3 class="feature-name">工作台</h3>
          <p class="feature-desc">管理面试计划和公司列表，支持拖拽排序</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3 class="feature-name">日历看板</h3>
          <p class="feature-desc">可视化任务管理，按日期规划日程</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3 class="feature-name">八股文</h3>
          <p class="feature-desc">前端面试必备知识点，代码编辑器支持</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📁</div>
          <h3 class="feature-name">文件上传</h3>
          <p class="feature-desc">分片上传 + 并发控制 + 内存监控</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌲</div>
          <h3 class="feature-name">人员树</h3>
          <p class="feature-desc">企业级组织架构可视化 + 懒加载</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-name">虚拟表格</h3>
          <p class="feature-desc">高性能大数据量列表渲染</p>
        </div>
      </div>
    </div>

    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const user = computed(() => {
  return store.getters['user/currentUser']
})

const goToWorkbench = () => {
  router.push('/workbench')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.home-container {
  padding: var(--spacing-xl) 200px;
  position: relative;
  overflow: hidden;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  top: -100px;
  left: -150px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%);
  bottom: -150px;
  right: -200px;
}

.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl) 0;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.avatar-section {
  margin-bottom: var(--spacing-md);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(41, 94, 172, 0.3);
}

.avatar-text {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.greeting {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.highlight {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: 500;
}

.description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.code-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 40px var(--color-shadow);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transform: perspective(1000px) rotateY(-5deg);
  transition: transform 0.3s ease;
}

.code-card:hover {
  transform: perspective(1000px) rotateY(0deg);
}

.code-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.code-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red {
  background: #ef4444;
}

.dot.yellow {
  background: #f59e0b;
}

.dot.green {
  background: #10b981;
}

.code-title {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin-left: var(--spacing-sm);
}

.code-content {
  padding: var(--spacing-lg);
  background: #1e1e1e;
}

.code-content pre {
  margin: 0;
}

.code-content code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #d4d4d4;
}

.keyword {
  color: #c586c0;
}

.variable {
  color: #9cdcfe;
}

.property {
  color: #9cdcfe;
}

.string {
  color: #ce9178;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: var(--spacing-xl) 0;
  text-align: center;
}

.skills-section,
.features-section {
  margin-bottom: var(--spacing-3xl);
  position: relative;
  z-index: 1;
}

.skills-grid,
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.skill-card,
.feature-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.skill-card:hover,
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--color-shadow);
  border-color: var(--color-primary);
}

.skill-icon,
.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.skill-name,
.feature-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.skill-desc,
.feature-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  box-shadow: 0 4px 12px rgba(41, 94, 172, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(41, 94, 172, 0.4);
  background: linear-gradient(135deg, var(--color-primary-hover), var(--color-primary));
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-hover);
}

@media (max-width: 768px) {
  .home-container {
    padding: var(--spacing-xl);
  }

  .hero-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .greeting {
    font-size: 2rem;
  }

  .code-card {
    transform: none;
  }

  .skills-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
