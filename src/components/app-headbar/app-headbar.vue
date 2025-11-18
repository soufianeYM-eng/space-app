<template>
  <div class="app-headbar">
    <Toolbar class="app-headbar__toolbar">
      <template #start>
        <div class="flex items-center gap-2">
          <img src="../../assets/images/logo.png" alt="Logo" class="app-headbar__logo" />
        </div>
      </template>

      <template #center>
        <TabMenu :model="menuItems" :activeIndex="activeIndex" @tab-change="onTabChange" />
      </template>

      <template #end>
        <div class="flex align-items-center gap-3">
          <span class="text-color">Hello {{ authenticatedAgentName }}!</span>
          <Button icon="pi pi-sign-out" label="Logout" severity="danger" outlined size="small" @click="handleLogout" />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar'
import TabMenu from 'primevue/tabmenu'
import Button from 'primevue/button'
import { useAppHeadbar } from './app-headbar.composable'

const { menuItems, activeIndex, onTabChange, handleLogout, authenticatedAgentName } = useAppHeadbar()
</script>

<style lang="scss" scoped>
.app-headbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--surface-card);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-headbar__toolbar {
  border-radius: 0 !important;
  padding: 1rem 1.5rem !important;
  border: none !important;
}

.app-headbar__logo {
  height: 40px;
}
</style>
