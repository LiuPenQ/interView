import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { isAuthenticated } from '../utils/auth'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    // 登录页面 - 独立页面，不需要布局
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    // 主应用布局 - 包含侧边栏的布局
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'workbench',
          name: 'Workbench',
          component: () => import('../views/dashboard/Workbench.vue')
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: () => import('../views/dashboard/CalendarTodo.vue')
        },
        {
          path: 'word',
          name: 'Word',
          redirect: '/word/theory'
        },
        {
          path: 'word/theory',
          name: 'WordTheory',
          component: () => import('../views/components/WordTheory.vue')
        },
        {
          path: 'word/coding',
          name: 'WordCoding',
          component: () => import('../views/components/WordCoding.vue')
        },
        {
          path: 'file-upload',
          name: 'FileUpload',
          component: () => import('../views/components/FileUpload.vue')
        },
        {
          path: 'virtual-table',
          name: 'VirtualTable',
          component: () => import('../views/components/VirtualTable.vue')
        },
        {
          path: 'tree-view',
          name: 'TreeView',
          component: () => import('../views/components/TreeView.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/profile/Profile.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫
// router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
//   // 检查路由是否需要认证
//   const requiresAuth = to.meta.requiresAuth !== false

//   // 如果需要认证且未登录，则重定向到登录页
//   if (requiresAuth && !isAuthenticated()) {
//     next({ name: 'Login' })
//   }
//   // 如果已登录且访问登录页，则重定向到首页
//   else if (isAuthenticated() && to.name === 'Login') {
//     next({ name: 'Home' })
//   }
//   // 其他情况正常导航
//   else {
//     next()
//   }
// })

// 全局后置守卫（可选，用于日志记录等）
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  console.log(`Navigation from ${String(from.name)} to ${String(to.name)}`)
})

export default router