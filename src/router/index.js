import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '../services/authApi';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductEntryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { redirectIfAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
  },
  {
    path: '/confirm-email',
    name: 'confirm-email',
    component: () => import('../views/ConfirmEmailView.vue'),
  },
  {
    path: '/forgot-password/confirm',
    name: 'forgot-confirm',
    component: () => import('../views/ForgotPasswordConfirmView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authed = isAuthenticated();
  if (to.meta?.requiresAuth && !authed) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta?.redirectIfAuth && authed) {
    return {
      name: 'profile',
    };
  }

  return true;
});

export default router;
