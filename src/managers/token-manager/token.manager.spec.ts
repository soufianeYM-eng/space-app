import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TokenManager } from './token.manager'

describe('TokenManager', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setToken()', () => {
    it('should save a valid token to localStorage', () => {
      const token = 'valid-token-123'
      TokenManager.setToken(token)

      expect(localStorage.getItem('api-token')).toBe(token)
    })

    it('should save an empty token if provided', () => {
      TokenManager.setToken('')

      expect(localStorage.getItem('api-token')).toBe('')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      TokenManager.setToken('valid-token')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to set token in localStorage')

      setItemSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getToken()', () => {
    it('should retrieve an existing token from localStorage', () => {
      localStorage.setItem('api-token', 'existing-token')

      const token = TokenManager.getToken()

      expect(token).toBe('existing-token')
    })

    it('should return null if no token exists', () => {
      const token = TokenManager.getToken()

      expect(token).toBe(null)
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      const token = TokenManager.getToken()

      expect(token).toBe(null)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get token from localStorage')

      getItemSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('clearToken()', () => {
    it('should remove the token from localStorage', () => {
      localStorage.setItem('api-token', 'token-to-remove')

      TokenManager.clearToken()

      expect(localStorage.getItem('api-token')).toBe(null)
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      TokenManager.clearToken()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear token from localStorage')

      removeItemSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('isValidToken()', () => {
    it.each([
      { token: 'valid-token-123', expected: true, description: 'valid token' },
      { token: 'abc', expected: true, description: 'short valid token' },
      { token: 'token-with-dashes-and-numbers-123', expected: true, description: 'long valid token' },
    ])('should return true for $description', ({ token, expected }) => {
      localStorage.setItem('api-token', token)

      expect(TokenManager.isValidToken()).toBe(expected)
    })

    it.each([
      { token: null, expected: false, description: 'no token (null)' },
      { token: '', expected: false, description: 'empty string' },
      { token: '   ', expected: false, description: 'only whitespace' },
      { token: '\t\n', expected: false, description: 'tabs and newlines' },
    ])('should return false for $description', ({ token, expected }) => {
      if (token !== null) {
        localStorage.setItem('api-token', token)
      }

      expect(TokenManager.isValidToken()).toBe(expected)
    })
  })
})
