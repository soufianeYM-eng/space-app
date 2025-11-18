<template>
  <div class="dashboard-page">
    <div class="p-4">
      <div class="mb-4">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-color-secondary">Welcome back, {{ authenticatedAgent?.email ?? 'Agent' }}</p>
      </div>

      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="dashboard-page__card" @click="navigateTo('Agent')">
            <template #content>
              <div class="flex flex-column align-items-center gap-3 p-3">
                <i class="pi pi-user text-6xl text-primary"></i>
                <h3 class="text-xl font-semibold m-0">Agent Details</h3>
                <p class="text-color-secondary text-center m-0">
                  View your agent information and stats
                </p>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="dashboard-page__card" @click="navigateTo('Systems')">
            <template #content>
              <div class="flex flex-column align-items-center gap-3 p-3">
                <i class="pi pi-globe text-6xl text-primary"></i>
                <h3 class="text-xl font-semibold m-0">Star Systems</h3>
                <p class="text-color-secondary text-center m-0">
                  Explore and navigate star systems
                </p>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="dashboard-page__card" @click="navigateTo('Fleet')">
            <template #content>
              <div class="flex flex-column align-items-center gap-3 p-3">
                <i class="pi pi-compass text-6xl text-primary"></i>
                <h3 class="text-xl font-semibold m-0">Fleet Management</h3>
                <p class="text-color-secondary text-center m-0">
                  Manage your ships and operations
                </p>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <Card class="dashboard-page__card" @click="navigateTo('Markets')">
            <template #content>
              <div class="flex flex-column align-items-center gap-3 p-3">
                <i class="pi pi-shopping-cart text-6xl text-primary"></i>
                <h3 class="text-xl font-semibold m-0">Markets & Trading</h3>
                <p class="text-color-secondary text-center m-0">
                  Browse markets and trade resources
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import { useAgentStore } from '@/stores/agent.store'

const router = useRouter()
const { authenticatedAgent } = storeToRefs(useAgentStore())

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--surface-ground);
}

.dashboard-page__card {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}
</style>
