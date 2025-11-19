<template>
  <div class="fleet-page p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">Fleet Management</h1>
      <p class="text-color-secondary">Manage your ships and their operations</p>
    </div>

    <Card>
      <template #content>
        <DataTable :value="ships" :loading="loading" :rows="meta.limit" :totalRecords="meta.total" lazy paginator
          @page="onPage" stripedRows responsiveLayout="scroll">
          <template #empty>
            <div class="text-center p-4">
              <i class="pi pi-compass text-4xl text-color-secondary mb-3"></i>
              <p class="text-color-secondary">No ships in your fleet</p>
            </div>
          </template>

          <Column field="symbol" header="Ship Symbol" sortable style="min-width: 200px">
            <template #body="slotProps">
              <div class="font-semibold">{{ slotProps.data.symbol }}</div>
            </template>
          </Column>

          <Column field="registration.name" header="Name" sortable style="min-width: 150px">
            <template #body="slotProps">
              {{ slotProps.data.registration?.name || 'N/A' }}
            </template>
          </Column>

          <Column field="registration.role" header="Role" sortable style="min-width: 150px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.registration?.role || 'N/A'" severity="info"></Tag>
            </template>
          </Column>

          <Column field="nav.status" header="Status" sortable style="min-width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.nav?.status || 'UNKNOWN'"
                :severity="getStatusSeverity(slotProps.data.nav?.status)"></Tag>
            </template>
          </Column>

          <Column field="nav.flightMode" header="Flight Mode" sortable style="min-width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.nav?.flightMode || 'N/A'" severity="secondary" size="small"></Tag>
            </template>
          </Column>

          <Column field="nav.waypointSymbol" header="Location" sortable style="min-width: 200px">
            <template #body="slotProps">
              <div class="text-sm">
                <div>{{ slotProps.data.nav?.waypointSymbol || 'N/A' }}</div>
                <div class="text-color-secondary">{{ slotProps.data.nav?.systemSymbol || '' }}</div>
              </div>
            </template>
          </Column>

          <Column field="fuel.current" header="Fuel" sortable style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <ProgressBar :value="getFuelPercentage(slotProps.data)" :showValue="false"
                  style="width: 80px; height: 8px"></ProgressBar>
                <span class="text-sm">
                  {{ slotProps.data.fuel?.current || 0 }} / {{ slotProps.data.fuel?.capacity || 0 }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="cargo.units" header="Cargo" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-sm">
                {{ slotProps.data.cargo?.units || 0 }} / {{ slotProps.data.cargo?.capacity || 0 }}
              </span>
            </template>
          </Column>

          <Column header="Frame" style="min-width: 150px">
            <template #body="slotProps">
              <div class="text-sm">
                <div>{{ slotProps.data.frame?.name || 'N/A' }}</div>
                <div class="text-color-secondary">Condition: {{ slotProps.data.frame?.condition || 0 }}%</div>
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
import ProgressBar from 'primevue/progressbar'
import type { Ship } from '@/types/ship.type'
import type { DataTablePageEvent } from 'primevue/datatable'
import { ShipNavigationStatus } from './fleet.enum'
import { useFleet } from './composables/fleet.composable'

const { ships, loading, meta, fetchShips } = useFleet()

const loadShips = async (page = 1) => {
  try {
    await fetchShips(page, meta.value.limit)
  } catch (error) {
    console.error('Failed to load ships:', error)
  }
}

const onPage = (event: DataTablePageEvent) => {
  const page = event.page + 1
  loadShips(page)
}

const getStatusSeverity = (status: ShipNavigationStatus | undefined) => {
  switch (status) {
    case ShipNavigationStatus.IN_TRANSIT:
      return 'warning'
    case ShipNavigationStatus.DOCKED:
      return 'success'
    case ShipNavigationStatus.IN_ORBIT:
      return 'info'
    default:
      return 'secondary'
  }
}

const getFuelPercentage = (ship: Ship) => {
  if (!ship.fuel?.capacity) return 0
  return (ship.fuel.current / ship.fuel.capacity) * 100
}

onMounted(() => {
  loadShips()
})
</script>

<style lang="scss" scoped>
.fleet-page {
  min-height: calc(100vh - 100px);
  background: var(--surface-ground);
}
</style>
