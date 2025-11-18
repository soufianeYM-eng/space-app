import type { Ship } from '@/types/ship.type'
import { FleetService } from '@/services/fleet/fleet.service'
import { usePagination } from '@/composables/use-pagination.composable'

export function useFleet() {
  const fetchShipsWithErrorHandling = async (page: number, limit: number) => {
    try {
      return await FleetService.getMyShips(page, limit)
    } catch (error) {
      console.error('Failed to load ships:', error)
      throw error
    }
  }

  const { data: ships, loading, meta, fetch: fetchShips } = usePagination<Ship>(
    fetchShipsWithErrorHandling,
  )

  return {
    ships,
    loading,
    meta,
    fetchShips,
  }
}
