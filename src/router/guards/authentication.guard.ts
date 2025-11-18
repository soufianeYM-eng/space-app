import { useAuthStore } from '@/stores/auth.store'
import type { NavigationGuard } from 'vue-router'

export const authenticationGuard: NavigationGuard = (to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.checkAuth()

  // Check if route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route without authentication
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    // Redirect to home if already authenticated and trying to access login
    next({ name: 'Home' })
  } else {
    // Allow navigation
    next()
  }
}
