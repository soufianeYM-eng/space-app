import { describe, it, expect, vi } from 'vitest'
import { useSystems } from './systems.composable'
import { SystemsService } from '@/services/systems/systems.service'
import { getSystemsResponseMock } from '@/__mocks__/system.mock'

vi.mock('@/services/systems/systems.service', () => ({
  SystemsService: {
    getSystems: vi.fn(),
  },
}))

describe('useSystems', () => {
  const mockSystemsResponse = getSystemsResponseMock()

  describe('initial state', () => {
    it('should initialize with empty systems array', () => {
      const { systems } = useSystems()

      expect(systems.value).toEqual([])
    })

    it('should initialize with loading false', () => {
      const { loading } = useSystems()

      expect(loading.value).toBe(false)
    })

    it('should initialize with default meta', () => {
      const { meta } = useSystems()

      expect(meta.value).toEqual({
        total: 0,
        page: 1,
        limit: 10,
      })
    })
  })

  describe('fetchSystems', () => {
    it('should fetch systems successfully', async () => {
      vi.mocked(SystemsService.getSystems).mockResolvedValue(mockSystemsResponse)

      const { systems, meta, loading, fetchSystems } = useSystems()

      await fetchSystems()

      expect(SystemsService.getSystems).toHaveBeenCalledWith(1, 10)
      expect(systems.value).toEqual(mockSystemsResponse.data)
      expect(meta.value).toEqual(mockSystemsResponse.meta)
      expect(loading.value).toBe(false)
    })

    it('should set loading to true during fetch', async () => {
      vi.mocked(SystemsService.getSystems).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockSystemsResponse), 100)
          }),
      )

      const { loading, fetchSystems } = useSystems()

      const promise = fetchSystems()
      expect(loading.value).toBe(true)

      await promise
      expect(loading.value).toBe(false)
    })

    it('should fetch systems with custom page and limit', async () => {
      vi.mocked(SystemsService.getSystems).mockResolvedValue(mockSystemsResponse)

      const { fetchSystems } = useSystems()

      await fetchSystems(3, 15)

      expect(SystemsService.getSystems).toHaveBeenCalledWith(3, 15)
    })

    it('should handle fetch error and set loading to false', async () => {
      const error = new Error('Failed to fetch systems')
      vi.mocked(SystemsService.getSystems).mockRejectedValue(error)

      const { loading, fetchSystems } = useSystems()

      await expect(fetchSystems()).rejects.toThrow('Failed to fetch systems')
      expect(loading.value).toBe(false)
    })

    it('should log error when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Network error')
      vi.mocked(SystemsService.getSystems).mockRejectedValue(error)

      const { fetchSystems } = useSystems()

      await expect(fetchSystems()).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load systems:', error)

      consoleSpy.mockRestore()
    })
  })

  describe('state reactivity', () => {
    it('should maintain separate state for multiple composable instances', async () => {
      vi.mocked(SystemsService.getSystems).mockResolvedValue(mockSystemsResponse)

      const instance1 = useSystems()
      const instance2 = useSystems()

      await instance1.fetchSystems()

      expect(instance1.systems.value).toEqual(mockSystemsResponse.data)
      expect(instance2.systems.value).toEqual([])
    })
  })
})
