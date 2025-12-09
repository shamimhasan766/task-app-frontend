import {createRouter, createWebHistory} from 'vue-router';
import Register from '../pages/register.vue';
import Login from '../pages/Login.vue';
import Task from '../pages/Task.vue';

const routes = [
    {path: '/', component: Login},
    {path: '/register', component: Register},
    {path: '/tasks', component: Task, meta: { requiresAuth: true }}
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !token) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router