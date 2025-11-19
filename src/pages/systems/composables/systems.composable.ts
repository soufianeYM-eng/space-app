import type { System } from '@/types/system.type'
import { SystemsService } from '@/services/systems/systems.service'
import { usePagination } from '@/composables/use-pagination.composable'

export function useSystems() {
  const fetchSystemsWithErrorHandling = async (page: number, limit: number) => {
    try {
      return await SystemsService.getSystems(page, limit)
    } catch (error) {
      console.error('Failed to load systems:', error)
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
        },
      }
    }
  }

  const { data: systems, loading, meta, fetch: fetchSystems } = usePagination<System>(
    fetchSystemsWithErrorHandling,
  )

  return {
    systems,
    loading,
    meta,
    fetchSystems,
  }
}
