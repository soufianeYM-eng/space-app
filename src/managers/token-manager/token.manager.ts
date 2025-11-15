/**
 *  Token Manager
 *  Manages the authentication token for API requests.
 */

export class TokenManager {
  private static readonly STORAGE_KEY = 'api-token' // Key for localStorage

  static getToken(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY)
    } catch {
      console.error('Failed to get token from localStorage')
      return null
    }
  }

  static setToken(token: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, token)
    } catch {
      console.error('Failed to set token in localStorage')
    }
  }

  static clearToken(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch {
      console.error('Failed to clear token from localStorage')
    }
  }

  static isValidToken(): boolean {
    const token = this.getToken()
    return token !== null && token.trim().length > 0
  }
}
