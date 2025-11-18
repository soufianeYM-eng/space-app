import { describe, it, expect, vi } from 'vitest'
import { useFleet } from './fleet.composable'
import { FleetService } from '@/services/fleet/fleet.service'
import { getShipsResponseMock } from '@/__mocks__/ship.mock'

vi.mock('@/services/fleet/fleet.service', () => ({
  FleetService: {
    getMyShips: vi.fn(),
  },
}))

describe('useFleet', () => {
  const mockShipsResponse = getShipsResponseMock()

  describe('initial state', () => {
    it('should initialize with empty ships array', () => {
      const { ships } = useFleet()

      expect(ships.value).toEqual([])
    })

    it('should initialize with loading false', () => {
      const { loading } = useFleet()

      expect(loading.value).toBe(false)
    })

    it('should initialize with default meta', () => {
      const { meta } = useFleet()

      expect(meta.value).toEqual({
        total: 0,
        page: 1,
        limit: 10,
      })
    })
  })

  describe('fetchShips', () => {
    it('should fetch ships successfully', async () => {
      vi.mocked(FleetService.getMyShips).mockResolvedValue(mockShipsResponse)

      const { ships, meta, loading, fetchShips } = useFleet()

      await fetchShips()

      expect(FleetService.getMyShips).toHaveBeenCalledWith(1, 10)
      expect(ships.value).toEqual(mockShipsResponse.data)
      expect(meta.value).toEqual(mockShipsResponse.meta)
      expect(loading.value).toBe(false)
    })

    it('should set loading to true during fetch', async () => {
      vi.mocked(FleetService.getMyShips).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockShipsResponse), 100)
          }),
      )

      const { loading, fetchShips } = useFleet()

      const promise = fetchShips()
      expect(loading.value).toBe(true)

      await promise
      expect(loading.value).toBe(false)
    })

    it('should fetch ships with custom page and limit', async () => {
      vi.mocked(FleetService.getMyShips).mockResolvedValue(mockShipsResponse)

      const { fetchShips } = useFleet()

      await fetchShips(2, 20)

      expect(FleetService.getMyShips).toHaveBeenCalledWith(2, 20)
    })

    it('should handle fetch error and set loading to false', async () => {
      const error = new Error('Failed to fetch ships')
      vi.mocked(FleetService.getMyShips).mockRejectedValue(error)

      const { loading, fetchShips } = useFleet()

      await expect(fetchShips()).rejects.toThrow('Failed to fetch ships')
      expect(loading.value).toBe(false)
    })

    it('should log error when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Network error')
      vi.mocked(FleetService.getMyShips).mockRejectedValue(error)

      const { fetchShips } = useFleet()

      await expect(fetchShips()).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load ships:', error)

      consoleSpy.mockRestore()
    })
  })

  describe('state reactivity', () => {
    it('should maintain separate state for multiple composable instances', async () => {
      vi.mocked(FleetService.getMyShips).mockResolvedValue(mockShipsResponse)

      const instance1 = useFleet()
      const instance2 = useFleet()

      await instance1.fetchShips()

      expect(instance1.ships.value).toEqual(mockShipsResponse.data)
      expect(instance2.ships.value).toEqual([])
    })
  })
})
