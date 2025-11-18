import type { Agent } from '@/types/agent.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAgentStore = defineStore('agent', () => {
  const authenticatedAgent = ref<Agent>()

  const setAuthenticatedAgent = (agentData: Agent | undefined) => {
    authenticatedAgent.value = agentData
  }

  return { authenticatedAgent, setAuthenticatedAgent }
})
