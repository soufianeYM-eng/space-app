import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TabMenuChangeEvent } from 'primevue/tabmenu'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { MenuItem } from './app-headbar.type'

import { useAgentStore } from '@/stores/agent.store'
import { useAuthStore } from '@/stores/auth.store'

export function useAppHeadbar() {
  const router: Router = useRouter()
  const route: RouteLocationNormalizedLoaded = useRoute()
  const authStore = useAuthStore()
  const agentStore = useAgentStore()

  const menuItems = ref<MenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: 'Home',
      command: () => router.push({ name: 'Home' }),
    },
    {
      label: 'Agent',
      icon: 'pi pi-user',
      route: 'Agent',
      command: () => router.push({ name: 'Agent' }),
    },
    {
      label: 'Systems',
      icon: 'pi pi-globe',
      route: 'Systems',
      command: () => router.push({ name: 'Systems' }),
    },
    {
      label: 'Fleet',
      icon: 'pi pi-compass',
      route: 'Fleet',
      command: () => router.push({ name: 'Fleet' }),
    },
    {
      label: 'Markets',
      icon: 'pi pi-shopping-cart',
      route: 'Markets',
      command: () => router.push({ name: 'Markets' }),
    },
  ])

  const activeIndex = computed(() => {
    const currentRouteName = route.name
    const index = menuItems.value.findIndex((item) => item.route === currentRouteName)
    return index >= 0 ? index : 0
  })

  const authenticatedAgentName = computed(() => agentStore.authenticatedAgent?.email ?? 'Agent')

  const onTabChange = (event: TabMenuChangeEvent) => {
    const selectedItem = menuItems.value[event.index]
    if (selectedItem?.command) {
      selectedItem.command()
    }
  }

  const handleLogout = () => {
    // Clear auth state
    authStore.logout()

    // Clear agent data
    agentStore.setAuthenticatedAgent(undefined)

    // Redirect to login
    router.push({ name: 'Login' })
  }

  return {
    menuItems,
    activeIndex,
    onTabChange,
    handleLogout,
    authenticatedAgentName,
  }
}
