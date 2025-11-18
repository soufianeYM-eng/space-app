<template>
  <div class="app__container">
    <AppHeadbar v-if="shouldShowHeadbar" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeadbar from '@/components/app-headbar/app-headbar.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAgentStore } from '@/stores/agent.store'
import { AuthService } from '@/services/auth/auth.service'

const route = useRoute()
const authStore = useAuthStore()
const agentStore = useAgentStore()

// Hide headbar on login page
const shouldShowHeadbar = computed(() => {
  return route.name !== 'Login'
})

// Fetch agent data on app mount if authenticated
const initializeApp = async () => {
  if (authStore.isAuthenticated === true) {
    try {
      const agent = await AuthService.getAccountDetails()
      agentStore.setAuthenticatedAgent(agent)
    } catch (error) {
      console.error('Failed to fetch agent data:', error)
      // If token is invalid, logout
      authStore.logout()
    }
  }
}

onMounted(() => {
  initializeApp()
})
</script>

<style scoped>
.app__container {
  min-height: 100vh;
  background: var(--surface-ground);
}
</style>
