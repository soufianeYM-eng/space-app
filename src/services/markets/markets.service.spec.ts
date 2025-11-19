import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MarketsService } from './markets.service'
import api from '@/api'

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('MarketsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMarket', () => {
    it.each([
      { systemSymbol: 'X1-DF55', waypointSymbol: 'X1-DF55-20250Z' },
      { systemSymbol: 'X1-ABC', waypointSymbol: 'X1-ABC-12345A' },
    ])(
      'should call GET /systems/$systemSymbol/waypoints/$waypointSymbol/market',
      async ({ systemSymbol, waypointSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await MarketsService.getMarket(systemSymbol, waypointSymbol)

        expect(api.get).toHaveBeenCalledWith(`/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('purchaseGoods', () => {
    it.each([
      { shipSymbol: 'SHIP-123', tradeSymbol: 'FUEL', units: 100 },
      { shipSymbol: 'SHIP-456', tradeSymbol: 'IRON_ORE', units: 50 },
    ])(
      'should call POST /my/ships/$shipSymbol/purchase with correct body',
      async ({ shipSymbol, tradeSymbol, units }) => {
        vi.mocked(api.post).mockResolvedValue({ data: { data: {} } })

        await MarketsService.purchaseGoods(shipSymbol, tradeSymbol, units)

        expect(api.post).toHaveBeenCalledWith(`/my/ships/${shipSymbol}/purchase`, {
          symbol: tradeSymbol,
          units,
        })
        expect(api.post).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('sellGoods', () => {
    it.each([
      { shipSymbol: 'SHIP-123', tradeSymbol: 'FUEL', units: 100 },
      { shipSymbol: 'SHIP-789', tradeSymbol: 'GOLD', units: 25 },
    ])('should call POST /my/ships/$shipSymbol/sell with correct body', async ({ shipSymbol, tradeSymbol, units }) => {
      vi.mocked(api.post).mockResolvedValue({ data: { data: {} } })

      await MarketsService.sellGoods(shipSymbol, tradeSymbol, units)

      expect(api.post).toHaveBeenCalledWith(`/my/ships/${shipSymbol}/sell`, {
        symbol: tradeSymbol,
        units,
      })
      expect(api.post).toHaveBeenCalledTimes(1)
    })
  })
})
