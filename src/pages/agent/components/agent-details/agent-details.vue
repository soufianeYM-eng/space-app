<template>
  <Card v-if="authenticatedAgent" class="agent-details__card">
    <template #content>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <span class="font-semibold text-sm text-color-secondary">Agent ID</span>
          <span class="text-color">{{ authenticatedAgent.id }}</span>
        </div>

        <div class="flex flex-column gap-1">
          <span class="font-semibold text-sm text-color-secondary">Email</span>
          <span class="text-color">{{ authenticatedAgent.email }}</span>
        </div>

        <div class="flex flex-column gap-1">
          <span class="font-semibold text-sm text-color-secondary">Member Since</span>
          <span class="text-color">{{ formattedDate }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import type { AgentDetailsProps } from './agent-details.type'

const props = defineProps<AgentDetailsProps>()

const formattedDate = computed(() => {
  if (!props.authenticatedAgent?.createdAt) return 'N/A'

  const date = new Date(props.authenticatedAgent.createdAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style lang="scss" scoped>
.agent-details__card {
  max-width: 500px;
}
</style>
