import { describe, it, expect, vi } from 'vitest'
import { AuthService } from './auth.service'
import api from '@/api'

vi.mock('@/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('AuthService', () => {
  describe('getAccountDetails', () => {
    it('should call GET /my/account', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { data: { account: {} } } })

      await AuthService.getAccountDetails()

      expect(api.get).toHaveBeenCalledWith('/my/account')
      expect(api.get).toHaveBeenCalledTimes(1)
    })
  })
})
