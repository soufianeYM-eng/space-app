import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SystemsService } from './systems.service'
import api from '@/api'

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('SystemsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSystems', () => {
    it.each([
      { page: 1, limit: 10, description: 'default parameters' },
      { page: 3, limit: 25, description: 'custom page and limit' },
      { page: 10, limit: 100, description: 'different page and limit' },
    ])('should call GET /systems with $description', async ({ page, limit }) => {
      vi.mocked(api.get).mockResolvedValue({ data: {} })

      await SystemsService.getSystems(page, limit)

      expect(api.get).toHaveBeenCalledWith('/systems', {
        params: { page, limit },
      })
      expect(api.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getSystemBySymbol', () => {
    it.each([{ systemSymbol: 'X1-DF55' }, { systemSymbol: 'X1-ABC' }, { systemSymbol: 'X1-XYZ123' }])(
      'should call GET /systems/$systemSymbol',
      async ({ systemSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await SystemsService.getSystemBySymbol(systemSymbol)

        expect(api.get).toHaveBeenCalledWith(`/systems/${systemSymbol}`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })

  describe('getSystemWaypoints', () => {
    it.each([{ systemSymbol: 'X1-DF55' }, { systemSymbol: 'X1-ABC' }, { systemSymbol: 'X1-TEST' }])(
      'should call GET /systems/$systemSymbol/waypoints',
      async ({ systemSymbol }) => {
        vi.mocked(api.get).mockResolvedValue({ data: { data: {} } })

        await SystemsService.getSystemWaypoints(systemSymbol)

        expect(api.get).toHaveBeenCalledWith(`/systems/${systemSymbol}/waypoints`)
        expect(api.get).toHaveBeenCalledTimes(1)
      },
    )
  })
})
