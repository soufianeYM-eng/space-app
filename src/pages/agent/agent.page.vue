<template>
  <div class="agent-page p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">Agent Details</h1>
      <p class="text-color-secondary">View your agent information and statistics</p>
    </div>
    <AgentDetails :authenticatedAgent class="agent-page__full-width-card" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AgentDetails from '@/pages/agent/components/agent-details/agent-details.vue'
import { useAgentStore } from '@/stores/agent.store'

const { authenticatedAgent } = storeToRefs(useAgentStore())
</script>

<style lang="scss" scoped>
.agent-page {
  min-height: calc(100vh - 100px);
  background: var(--surface-ground);
}
</style>
