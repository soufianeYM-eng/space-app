const routes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/login/login.page.vue'),
    meta: { requiresAuth: false },
  },
  {
    name: 'Home',
    path: '',
    component: () => import('@/pages/home/home.page.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'Agent',
    path: '/agent',
    component: () => import('@/pages/agent/agent.page.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'Systems',
    path: '/systems',
    component: () => import('@/pages/systems/systems.page.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'Fleet',
    path: '/fleet',
    component: () => import('@/pages/fleet/fleet.page.vue'),
    meta: { requiresAuth: true },
  },
  {
    name: 'Markets',
    path: '/markets',
    component: () => import('@/pages/markets/markets.page.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
