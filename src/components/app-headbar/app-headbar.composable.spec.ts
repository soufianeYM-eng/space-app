import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppHeadbar } from './app-headbar.composable'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useAgentStore } from '@/stores/agent.store'
import { getAgentMock } from '@/__mocks__/agent.mock'

// Mock vue-router
const mockPush = vi.fn()
const mockRoute = {
  name: 'Home',
}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => mockRoute,
}))

describe('useAppHeadbar', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
  })

  describe('menuItems', () => {
    it('should return 5 menu items', () => {
      const { menuItems } = useAppHeadbar()

      expect(menuItems.value).toHaveLength(5)
    })

    it('should have correct menu structure', () => {
      const { menuItems } = useAppHeadbar()

      const expectedRoutes = ['Home', 'Agent', 'Systems', 'Fleet', 'Markets']
      const actualRoutes = menuItems.value.map((item) => item.route)

      expect(actualRoutes).toEqual(expectedRoutes)
    })

    it('should have icons for all menu items', () => {
      const { menuItems } = useAppHeadbar()

      menuItems.value.forEach((item) => {
        expect(item.icon).toBeTruthy()
        expect(item.icon).toMatch(/^pi pi-/)
      })
    })

    it('should have command functions for all menu items', () => {
      const { menuItems } = useAppHeadbar()

      menuItems.value.forEach((item) => {
        expect(item.command).toBeTypeOf('function')
      })
    })
  })

  describe('activeIndex', () => {
    it.each([
      { routeName: 'Home', expectedIndex: 0 },
      { routeName: 'Agent', expectedIndex: 1 },
      { routeName: 'Systems', expectedIndex: 2 },
      { routeName: 'Fleet', expectedIndex: 3 },
      { routeName: 'Markets', expectedIndex: 4 },
      { routeName: 'UnknownRoute', expectedIndex: 0 },
    ])('should return $expectedIndex when current route is $routeName', ({ routeName, expectedIndex }) => {
      mockRoute.name = routeName
      const { activeIndex } = useAppHeadbar()

      expect(activeIndex.value).toBe(expectedIndex)
    })
  })

  describe('onTabChange', () => {
    it.each([
      { index: 0, expectedRoute: 'Home' },
      { index: 1, expectedRoute: 'Agent' },
      { index: 2, expectedRoute: 'Systems' },
      { index: 3, expectedRoute: 'Fleet' },
      { index: 4, expectedRoute: 'Markets' },
    ])('should call router.push when tab is changed to $expectedRoute (index $index)', ({ index, expectedRoute }) => {
      mockPush.mockClear() // Clear mocks before each iteration
      const { onTabChange } = useAppHeadbar()

      onTabChange({ index, originalEvent: {} as Event })

      expect(mockPush).toHaveBeenCalledWith({ name: expectedRoute })
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should not crash when index is out of bounds', () => {
      mockPush.mockClear()
      const { onTabChange } = useAppHeadbar()

      expect(() => {
        onTabChange({ index: 999, originalEvent: {} as Event })
      }).not.toThrow()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('handleLogout', () => {
    it('should call authStore.logout', () => {
      const { handleLogout } = useAppHeadbar()
      const authStore = useAuthStore()
      const logoutSpy = vi.spyOn(authStore, 'logout')

      handleLogout()

      expect(logoutSpy).toHaveBeenCalledTimes(1)
    })

    it('should clear authenticated agent', () => {
      const { handleLogout } = useAppHeadbar()
      const agentStore = useAgentStore()

      // Set an agent first
      const mockAgent = getAgentMock()
      agentStore.setAuthenticatedAgent(mockAgent)

      expect(agentStore.authenticatedAgent).toStrictEqual(mockAgent)

      // Logout
      handleLogout()

      expect(agentStore.authenticatedAgent).toBeUndefined()
    })

    it('should redirect to login page', () => {
      mockPush.mockClear()
      const { handleLogout } = useAppHeadbar()

      handleLogout()

      expect(mockPush).toHaveBeenCalledWith({ name: 'Login' })
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should perform logout flow in correct order', () => {
      const { handleLogout } = useAppHeadbar()
      const authStore = useAuthStore()
      const agentStore = useAgentStore()

      const callOrder: string[] = []

      // Spy on methods to track call order
      const logoutSpy = vi.spyOn(authStore, 'logout').mockImplementation(() => {
        callOrder.push('logout')
      })
      const setAgentSpy = vi.spyOn(agentStore, 'setAuthenticatedAgent').mockImplementation(() => {
        callOrder.push('setAgent')
      })
      mockPush.mockImplementation(() => {
        callOrder.push('push')
      })

      handleLogout()

      expect(callOrder).toEqual(['logout', 'setAgent', 'push'])
      expect(logoutSpy).toHaveBeenCalledTimes(1)
      expect(setAgentSpy).toHaveBeenCalledWith(undefined)
      expect(mockPush).toHaveBeenCalledWith({ name: 'Login' })
    })
  })

  describe('authenticatedAgentName', () => {
    it('should return Agent when no agent is set', () => {
      const { authenticatedAgentName } = useAppHeadbar()

      expect(authenticatedAgentName.value).toStrictEqual('Agent')
    })

    it('should return authenticated agent when set', () => {
      const agentStore = useAgentStore()
      const mockAgent = getAgentMock()

      agentStore.setAuthenticatedAgent(mockAgent)

      const { authenticatedAgentName } = useAppHeadbar()

      expect(authenticatedAgentName.value).toStrictEqual(mockAgent.email)
    })
  })
})
