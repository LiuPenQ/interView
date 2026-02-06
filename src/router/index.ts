import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/workbench'
    },
    {
      path: '/workbench',
      name: 'Workbench',
      component: () => import('../views/Workbench.vue')
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/CalendarTodo.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
    },
    {
      path: '/file-upload',
      name: 'FileUpload',
      component: () => import('../views/FileUpload.vue')
    }
  ]
})

export default router