import { ref } from 'vue'
import type { PaginationMeta, PaginatedResponse } from '@/types/common.type'

export function usePagination<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  defaultLimit = 10,
) {
  const data = ref<T[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    total: 0,
    page: 1,
    limit: defaultLimit,
  })

  const fetch = async (page = 1, limit = meta.value.limit) => {
    try {
      loading.value = true
      const response = await fetchFn(page, limit)
      data.value = response.data
      meta.value = response.meta
    } catch (error) {
      console.error('Failed to fetch paginated data:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    meta,
    fetch,
  }
}
