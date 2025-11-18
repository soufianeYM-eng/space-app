import { createRouter, createWebHistory } from 'vue-router'
import { authenticationGuard } from './guards/authentication.guard'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Setup navigation guards
router.beforeEach(authenticationGuard)

export default router
