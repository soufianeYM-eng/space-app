import api from '@/api'
import type { SystemsResponse, System } from '@/types/system.type'

export class SystemsService {
  static getSystems = async (page = 1, limit = 10): Promise<SystemsResponse> => {
    const response = await api.get('/systems', {
      params: { page, limit },
    })
    return response.data
  }

  static getSystemBySymbol = async (systemSymbol: string): Promise<System> => {
    const response = await api.get(`/systems/${systemSymbol}`)
    return response.data.data
  }

  static getSystemWaypoints = async (systemSymbol: string) => {
    const response = await api.get(`/systems/${systemSymbol}/waypoints`)
    return response.data.data
  }
}
