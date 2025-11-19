<template>
  <div class="systems-page p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">Star Systems Exploration</h1>
      <p class="text-color-secondary">Discover and navigate through star systems</p>
    </div>

    <Card>
      <template #content>
        <DataTable :value="systems" :loading="loading" :rows="meta.limit" :totalRecords="meta.total" lazy paginator
          @page="onPage" stripedRows responsiveLayout="scroll">
          <template #empty>
            <div class="text-center p-4">
              <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
              <p class="text-color-secondary">No systems found</p>
            </div>
          </template>

          <Column field="symbol" header="Symbol" sortable style="min-width: 150px">
            <template #body="slotProps">
              <div class="font-semibold">{{ slotProps.data.symbol }}</div>
            </template>
          </Column>

          <Column field="name" header="Name" sortable style="min-width: 200px">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>

          <Column field="type" header="Type" sortable style="min-width: 150px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" severity="info"></Tag>
            </template>
          </Column>

          <Column field="constellation" header="Constellation" sortable style="min-width: 150px">
            <template #body="slotProps">
              {{ slotProps.data.constellation }}
            </template>
          </Column>

          <Column field="sectorSymbol" header="Sector" sortable style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-sm">{{ slotProps.data.sectorSymbol }}</span>
            </template>
          </Column>

          <Column header="Coordinates" style="min-width: 120px">
            <template #body="slotProps">
              <div class="text-sm">
                <div>X: {{ slotProps.data.x }}</div>
                <div>Y: {{ slotProps.data.y }}</div>
              </div>
            </template>
          </Column>

          <Column header="Waypoints" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.waypoints?.length || 0" severity="secondary"></Tag>
            </template>
          </Column>

          <Column header="Factions" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex flex-wrap gap-1">
                <Tag v-for="(faction, index) in slotProps.data.factions" :key="index" :value="faction.symbol"
                  severity="warning" size="small"></Tag>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { DataTablePageEvent } from 'primevue/datatable'
import { useSystems } from './composables/systems.composable'

const { systems, loading, meta, fetchSystems } = useSystems()

const loadSystems = async (page = 1) => {
  try {
    await fetchSystems(page, meta.value.limit)
  } catch (error) {
    console.error('Failed to load systems:', error)
  }
}

const onPage = (event: DataTablePageEvent) => {
  const page = event.page + 1 // PrimeVue uses 0-based index
  loadSystems(page)
}

onMounted(() => {
  loadSystems()
})
</script>

<style lang="scss" scoped>
.systems-page {
  min-height: calc(100vh - 100px);
  background: var(--surface-ground);
}
</style>
