import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useMarkets } from './markets.composable'
import { MarketsService } from '@/services/markets/markets.service'
import { getMarketMock } from '@/__mocks__/market.mock'
import { getShipMock } from '@/__mocks__/ship.mock'
import { MarketSupplyLevel, MarketActivityLevel, TradeGoodType } from '../markets.enum'
import type { Ship } from '@/types/ship.type'

vi.mock('@/services/markets/markets.service', () => ({
  MarketsService: {
    getMarket: vi.fn(),
  },
}))

describe('useMarkets', () => {
  const mockMarket = getMarketMock()

  describe('initial state', () => {
    it('should initialize with undefined currentMarket', () => {
      const { currentMarket } = useMarkets()

      expect(currentMarket.value).toBeUndefined()
    })

    it('should initialize with loading false', () => {
      const { loading } = useMarkets()

      expect(loading.value).toBe(false)
    })

    it('should initialize with empty systemSymbol', () => {
      const { systemSymbol } = useMarkets()

      expect(systemSymbol.value).toBe('')
    })

    it('should initialize with empty waypointSymbol', () => {
      const { waypointSymbol } = useMarkets()

      expect(waypointSymbol.value).toBe('')
    })

    it('should initialize with empty error', () => {
      const { error } = useMarkets()

      expect(error.value).toBe('')
    })
  })

  describe('fetchMarket', () => {
    it('should fetch market successfully', async () => {
      vi.mocked(MarketsService.getMarket).mockResolvedValue(mockMarket)

      const { currentMarket, loading, fetchMarket } = useMarkets()

      const result = await fetchMarket('X1-TEST', 'X1-TEST-A1')

      expect(MarketsService.getMarket).toHaveBeenCalledWith('X1-TEST', 'X1-TEST-A1')
      expect(currentMarket.value).toEqual(mockMarket)
      expect(result).toEqual(mockMarket)
      expect(loading.value).toBe(false)
    })

    it('should set loading to true during fetch', async () => {
      vi.mocked(MarketsService.getMarket).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockMarket), 100)
          }),
      )

      const { loading, fetchMarket } = useMarkets()

      const promise = fetchMarket('X1-TEST', 'X1-TEST-A1')
      expect(loading.value).toBe(true)

      await promise
      expect(loading.value).toBe(false)
    })

    it('should handle fetch error and set loading to false', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Market not found')
      vi.mocked(MarketsService.getMarket).mockRejectedValue(error)

      const { loading, fetchMarket } = useMarkets()

      await fetchMarket('X1-INVALID', 'X1-INVALID-A1')
      expect(loading.value).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load market:', error)

      consoleSpy.mockRestore()
    })

    it('should log error when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('API error')
      vi.mocked(MarketsService.getMarket).mockRejectedValue(error)

      const { fetchMarket } = useMarkets()

      await fetchMarket('X1-TEST', 'X1-TEST-A1')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load market:', error)

      consoleSpy.mockRestore()
    })

    it('should update currentMarket when fetching different markets', async () => {
      const market1 = { ...mockMarket, symbol: 'X1-TEST-A1' }
      const market2 = { ...mockMarket, symbol: 'X1-TEST-B2' }

      vi.mocked(MarketsService.getMarket).mockResolvedValueOnce(market1).mockResolvedValueOnce(market2)

      const { currentMarket, fetchMarket } = useMarkets()

      await fetchMarket('X1-TEST', 'X1-TEST-A1')
      expect(currentMarket.value?.symbol).toBe('X1-TEST-A1')

      await fetchMarket('X1-TEST', 'X1-TEST-B2')
      expect(currentMarket.value?.symbol).toBe('X1-TEST-B2')
    })
  })

  describe('state reactivity', () => {
    it('should maintain separate state for multiple composable instances', async () => {
      vi.mocked(MarketsService.getMarket).mockResolvedValue(mockMarket)

      const instance1 = useMarkets()
      const instance2 = useMarkets()

      await instance1.fetchMarket('X1-TEST', 'X1-TEST-A1')

      expect(instance1.currentMarket.value).toEqual(mockMarket)
      expect(instance2.currentMarket.value).toBeUndefined()
    })
  })

  describe('loadMarket', () => {
    it('should set error when systemSymbol is missing', async () => {
      const { loadMarket, error, waypointSymbol } = useMarkets()
      waypointSymbol.value = 'X1-TEST-A1'

      await loadMarket()

      expect(error.value).toBe('Please enter both system and waypoint symbols')
    })

    it('should set error when waypointSymbol is missing', async () => {
      const { loadMarket, error, systemSymbol } = useMarkets()
      systemSymbol.value = 'X1-TEST'

      await loadMarket()

      expect(error.value).toBe('Please enter both system and waypoint symbols')
    })

    it('should clear error and load market successfully', async () => {
      vi.mocked(MarketsService.getMarket).mockResolvedValue(mockMarket)

      const { loadMarket, error, systemSymbol, waypointSymbol, currentMarket } = useMarkets()
      systemSymbol.value = 'X1-TEST'
      waypointSymbol.value = 'X1-TEST-A1'

      await loadMarket()

      expect(error.value).toBe('')
      expect(currentMarket.value).toEqual(mockMarket)
    })

    it('should set error message when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const apiError = {
        response: {
          data: {
            error: {
              message: 'Market not accessible',
            },
          },
        },
      }
      vi.mocked(MarketsService.getMarket).mockRejectedValue(apiError)

      const { loadMarket, error, systemSymbol, waypointSymbol } = useMarkets()
      systemSymbol.value = 'X1-TEST'
      waypointSymbol.value = 'X1-TEST-A1'

      await loadMarket()
      expect(error.value).toBe('Failed to load market data. Make sure you have a ship at this waypoint.')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should set default error message when fetch fails without specific message', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const genericError = new Error('Network error')
      vi.mocked(MarketsService.getMarket).mockRejectedValue(genericError)

      const { loadMarket, error, systemSymbol, waypointSymbol } = useMarkets()
      systemSymbol.value = 'X1-TEST'
      waypointSymbol.value = 'X1-TEST-A1'

      await loadMarket()
      expect(error.value).toBe('Failed to load market data. Make sure you have a ship at this waypoint.')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('loadShipLocations', () => {
    it('should fetch ships when ships array is empty', async () => {
      const mockShip = getShipMock()
      const fetchShips = vi.fn().mockResolvedValue(undefined)
      vi.mocked(MarketsService.getMarket).mockResolvedValue(mockMarket)

      const { loadShipLocations, systemSymbol, waypointSymbol } = useMarkets()

      const emptyShips = ref<Ship[]>([])
      await loadShipLocations(emptyShips, async () => {
        emptyShips.value = [mockShip]
        await fetchShips()
      })

      expect(fetchShips).toHaveBeenCalled()
      expect(systemSymbol.value).toBe(mockShip.nav.systemSymbol)
      expect(waypointSymbol.value).toBe(mockShip.nav.waypointSymbol)
    })

    it('should use first ship location and load market', async () => {
      const mockShip = getShipMock()
      const ships = ref([mockShip])
      const fetchShips = vi.fn()
      vi.mocked(MarketsService.getMarket).mockResolvedValue(mockMarket)

      const { loadShipLocations, systemSymbol, waypointSymbol, currentMarket } = useMarkets()

      await loadShipLocations(ships, fetchShips)

      expect(fetchShips).not.toHaveBeenCalled() // Should not fetch when ships already exist
      expect(systemSymbol.value).toBe(mockShip.nav.systemSymbol)
      expect(waypointSymbol.value).toBe(mockShip.nav.waypointSymbol)
      expect(currentMarket.value).toEqual(mockMarket)
    })

    it('should set error when loading fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockShip = getShipMock()
      const ships = ref([mockShip])
      const fetchShips = vi.fn()
      const loadError = new Error('Failed to load')
      vi.mocked(MarketsService.getMarket).mockRejectedValue(loadError)

      const { loadShipLocations, error } = useMarkets()

      await loadShipLocations(ships, fetchShips)
      expect(error.value).toBe('Failed to load ship locations')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('getSupplySeverity', () => {
    it.each([
      { supply: MarketSupplyLevel.ABUNDANT, expected: 'success' },
      { supply: MarketSupplyLevel.HIGH, expected: 'info' },
      { supply: MarketSupplyLevel.MODERATE, expected: 'warning' },
      { supply: MarketSupplyLevel.LIMITED, expected: 'danger' },
      { supply: MarketSupplyLevel.SCARCE, expected: 'danger' },
    ])('should return $expected for $supply', ({ supply, expected }) => {
      const { getSupplySeverity } = useMarkets()

      expect(getSupplySeverity(supply)).toBe(expected)
    })
  })

  describe('getActivitySeverity', () => {
    it.each([
      { activity: MarketActivityLevel.STRONG, expected: 'success' },
      { activity: MarketActivityLevel.GROWING, expected: 'info' },
      { activity: MarketActivityLevel.WEAK, expected: 'warning' },
      { activity: MarketActivityLevel.RESTRICTED, expected: 'danger' },
    ])('should return $expected for $activity', ({ activity, expected }) => {
      const { getActivitySeverity } = useMarkets()

      expect(getActivitySeverity(activity)).toBe(expected)
    })
  })

  describe('getTypeSeverity', () => {
    it.each([
      { type: TradeGoodType.EXPORT, expected: 'success' },
      { type: TradeGoodType.IMPORT, expected: 'info' },
      { type: TradeGoodType.EXCHANGE, expected: 'warning' },
    ])('should return $expected for $type', ({ type, expected }) => {
      const { getTypeSeverity } = useMarkets()

      expect(getTypeSeverity(type)).toBe(expected)
    })
  })
})
