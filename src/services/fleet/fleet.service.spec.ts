import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FleetService } from './fleet.service'
import api from '@/api'

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('FleetService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMyShips', () => {
    it.each([
      { page: 1, limit: 10, description: 'default parameters' },
      { page: 2, limit: 20, description: 'custom page and limit' },
      { page: 5, limit: 50, description: 'different page and limit' },
    ])('should call GET /my/ships with $description', async ({ page, limit }) => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      await FleetService.getMyShips(page, limit)

      expect(api.get).toHaveBeenCalledWith('/my/ships', {
        params: { page, limit },
      })
      expect(api.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getShip', () => {
    it.each([{ shipSymbol: 'SHIP-123' }, { shipSymbol: 'SHIP-456' }])(
      'should call GET /my/ships/$shipSymbol',
      async ({ shipSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await FleetService.getShip(shipSymbol)

        expect(api.get).toHaveBeenCalledWith(`/my/ships/${shipSymbol}`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('getShipCargo', () => {
    it.each([{ shipSymbol: 'SHIP-123' }, { shipSymbol: 'SHIP-789' }])(
      'should call GET /my/ships/$shipSymbol/cargo',
      async ({ shipSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await FleetService.getShipCargo(shipSymbol)

        expect(api.get).toHaveBeenCalledWith(`/my/ships/${shipSymbol}/cargo`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('getShipNav', () => {
    it.each([{ shipSymbol: 'SHIP-123' }, { shipSymbol: 'SHIP-ABC' }])(
      'should call GET /my/ships/$shipSymbol/nav',
      async ({ shipSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await FleetService.getShipNav(shipSymbol)

        expect(api.get).toHaveBeenCalledWith(`/my/ships/${shipSymbol}/nav`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })
})
