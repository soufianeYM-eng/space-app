import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TokenManager } from '@/managers/token-manager/token.manager'

export const useAuthStore = defineStore('auth', () => {
  // Check if token exists on initialization
  const isAuthenticated = ref(TokenManager.isValidToken())

  const login = (token: string) => {
    TokenManager.setToken(token)
    isAuthenticated.value = true
  }

  const logout = () => {
    TokenManager.clearToken()
    isAuthenticated.value = false
  }

  const checkAuth = () => {
    isAuthenticated.value = TokenManager.isValidToken()
    return isAuthenticated.value
  }

  return { isAuthenticated, login, logout, checkAuth }
})
