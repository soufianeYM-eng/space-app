import type { Market } from '@/types/market.type'
import type { Ship } from '@/types/ship.type'
import type { Ref } from 'vue'
import { MarketsService } from '@/services/markets/markets.service'
import { ref } from 'vue'
import { MarketSupplyLevel, MarketActivityLevel, TradeGoodType } from '../markets.enum'

export function useMarkets() {
  const currentMarket = ref<Market>()
  const loading = ref(false)
  const systemSymbol = ref('')
  const waypointSymbol = ref('')
  const error = ref('')

  const fetchMarket = async (systemSymbol: string, waypointSymbol: string) => {
    try {
      loading.value = true
      const market = await MarketsService.getMarket(systemSymbol, waypointSymbol)
      currentMarket.value = market
      return market
    } catch (error) {
      console.error('Failed to load market:', error)
    } finally {
      loading.value = false
    }
  }

  const loadMarket = async () => {
    if (!systemSymbol.value || !waypointSymbol.value) {
      error.value = 'Please enter both system and waypoint symbols'
      return
    }

    error.value = ''
    const result = await fetchMarket(systemSymbol.value, waypointSymbol.value)
    if (!result) {
      error.value = 'Failed to load market data. Make sure you have a ship at this waypoint.'
    }
  }

  const loadShipLocations = async (ships: Ref<Ship[]>, fetchShips: () => Promise<void>) => {
    if (ships.value.length === 0) {
      await fetchShips()
    }

    const firstShip = ships.value[0]
    if (firstShip) {
      systemSymbol.value = firstShip.nav.systemSymbol
      waypointSymbol.value = firstShip.nav.waypointSymbol
      await loadMarket()
      if (error.value && !error.value.includes('Please enter both')) {
        error.value = 'Failed to load ship locations'
      }
    }
  }

  const getSupplySeverity = (supply: MarketSupplyLevel) => {
    switch (supply) {
      case MarketSupplyLevel.ABUNDANT:
        return 'success'
      case MarketSupplyLevel.HIGH:
        return 'info'
      case MarketSupplyLevel.MODERATE:
        return 'warning'
      case MarketSupplyLevel.LIMITED:
      case MarketSupplyLevel.SCARCE:
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getActivitySeverity = (activity: MarketActivityLevel) => {
    switch (activity) {
      case MarketActivityLevel.STRONG:
        return 'success'
      case MarketActivityLevel.GROWING:
        return 'info'
      case MarketActivityLevel.WEAK:
        return 'warning'
      case MarketActivityLevel.RESTRICTED:
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getTypeSeverity = (type: TradeGoodType) => {
    switch (type) {
      case TradeGoodType.EXPORT:
        return 'success'
      case TradeGoodType.IMPORT:
        return 'info'
      case TradeGoodType.EXCHANGE:
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return {
    currentMarket,
    loading,
    systemSymbol,
    waypointSymbol,
    error,
    fetchMarket,
    loadMarket,
    loadShipLocations,
    getSupplySeverity,
    getActivitySeverity,
    getTypeSeverity,
  }
}
