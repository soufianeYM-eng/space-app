<template>
  <div class="markets-page p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">Markets & Trading</h1>
      <p class="text-color-secondary">Browse markets and trade resources</p>
    </div>

    <!-- Waypoint Selection Card -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-map-marker"></i>
            <span class="font-semibold">Select Waypoint to View Market</span>
          </div>
          <div class="grid">
            <div class="col-12 md:col-6">
              <label for="systemSymbol" class="block mb-2">System Symbol</label>
              <InputText id="systemSymbol" v-model="systemSymbol" placeholder="e.g., X1-DF55" class="w-full" />
            </div>
            <div class="col-12 md:col-6">
              <label for="waypointSymbol" class="block mb-2">Waypoint Symbol</label>
              <InputText id="waypointSymbol" v-model="waypointSymbol" placeholder="e.g., X1-DF55-20250Z"
                class="w-full" />
            </div>
          </div>
          <div class="flex gap-2">
            <Button label="Load Market" icon="pi pi-search" :loading="loading"
              :disabled="!systemSymbol || !waypointSymbol" @click="loadMarket" />
            <Button v-if="ships.length > 0" label="Use Ship Location" icon="pi pi-compass" severity="secondary" outlined
              @click="handleLoadShipLocations" />
          </div>
          <Message v-if="error" severity="error">{{ error }}</Message>
        </div>
      </template>
    </Card>

    <div v-if="loading" class="text-center p-6">
      <Card>
        <template #content>
          <i class="pi pi-spin pi-spinner text-4xl text-color-secondary mb-3"></i>
          <p class="text-color-secondary">Loading market data...</p>
        </template>
      </Card>
    </div>

    <div v-else-if="!currentMarket" class="text-center p-6">
      <Card>
        <template #content>
          <i class="pi pi-shopping-cart text-6xl text-color-secondary mb-4"></i>
          <h3 class="text-xl mb-2">No Market Data</h3>
          <p class="text-color-secondary mb-4">
            Enter a system and waypoint symbol above to view market data
          </p>
          <Message severity="info">
            Markets are available at specific waypoints in star systems. You need to have a ship at the waypoint to view
            market prices.
          </Message>
        </template>
      </Card>
    </div>

    <div v-else class="grid">
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>Exports</template>
          <template #content>
            <DataTable :value="currentMarket.exports" responsiveLayout="scroll" :rows="5" paginator>
              <template #empty>
                <div class="text-center p-3">
                  <p class="text-color-secondary">No exports available</p>
                </div>
              </template>

              <Column field="symbol" header="Symbol" sortable></Column>
              <Column field="name" header="Name" sortable></Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="col-12 lg:col-6">
        <Card>
          <template #title>Imports</template>
          <template #content>
            <DataTable :value="currentMarket.imports" responsiveLayout="scroll" :rows="5" paginator>
              <template #empty>
                <div class="text-center p-3">
                  <p class="text-color-secondary">No imports available</p>
                </div>
              </template>

              <Column field="symbol" header="Symbol" sortable></Column>
              <Column field="name" header="Name" sortable></Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div v-if="currentMarket.tradeGoods && currentMarket.tradeGoods.length > 0" class="col-12">
        <Card>
          <template #title>Market Prices</template>
          <template #content>
            <DataTable :value="currentMarket.tradeGoods" responsiveLayout="scroll" sortField="symbol" :sortOrder="1"
              stripedRows>
              <Column field="symbol" header="Good" sortable style="min-width: 150px">
                <template #body="slotProps">
                  <div class="font-semibold">{{ slotProps.data.symbol }}</div>
                </template>
              </Column>
              <Column field="name" header="Name" sortable style="min-width: 200px">
                <template #body="slotProps">
                  <div>
                    <div>{{ slotProps.data.name }}</div>
                    <div v-if="slotProps.data.description" class="text-sm text-color-secondary">
                      {{ slotProps.data.description }}
                    </div>
                  </div>
                </template>
              </Column>
              <Column field="type" header="Type" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.type" :value="slotProps.data.type"
                    :severity="getTypeSeverity(slotProps.data.type)"></Tag>
                </template>
              </Column>
              <Column field="tradeVolume" header="Volume" sortable style="min-width: 100px">
                <template #body="slotProps">
                  {{ slotProps.data.tradeVolume.toLocaleString() }}
                </template>
              </Column>
              <Column field="supply" header="Supply" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.supply" :severity="getSupplySeverity(slotProps.data.supply)"></Tag>
                </template>
              </Column>
              <Column field="activity" header="Activity" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.activity" :value="slotProps.data.activity"
                    :severity="getActivitySeverity(slotProps.data.activity)" size="small"></Tag>
                </template>
              </Column>
              <Column field="purchasePrice" header="Buy Price" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <span class="font-semibold text-green-500">{{ slotProps.data.purchasePrice.toLocaleString() }}
                    ¢</span>
                </template>
              </Column>
              <Column field="sellPrice" header="Sell Price" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <span class="font-semibold text-blue-500">{{ slotProps.data.sellPrice.toLocaleString() }} ¢</span>
                </template>
              </Column>
              <Column header="Margin" style="min-width: 100px">
                <template #body="slotProps">
                  <span class="font-semibold">
                    {{ ((slotProps.data.sellPrice - slotProps.data.purchasePrice) / slotProps.data.purchasePrice *
                    100).toFixed(1) }}%
                  </span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'
import { useMarkets } from './markets.composable'
import { useFleet } from '../fleet/fleet.composable'

const {
  currentMarket,
  loading,
  systemSymbol,
  waypointSymbol,
  error,
  loadMarket,
  loadShipLocations,
  getSupplySeverity,
  getActivitySeverity,
  getTypeSeverity,
} = useMarkets()
const { ships, fetchShips } = useFleet()

const handleLoadShipLocations = () => {
  loadShipLocations(ships, () => fetchShips(1, 10))
}

onMounted(() => {
  // Optionally auto-load ship locations on mount
  const firstShip = ships.value[0]
  if (firstShip) {
    systemSymbol.value = firstShip.nav.systemSymbol
    waypointSymbol.value = firstShip.nav.waypointSymbol
  }
})
</script>

<style lang="scss" scoped>
.markets-page {
  min-height: calc(100vh - 100px);
  background: var(--surface-ground);
}
</style>
