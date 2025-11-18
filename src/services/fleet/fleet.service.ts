import api from '@/api'
import type { ShipsResponse, Ship } from '@/types/ship.type'

export class FleetService {
  static getMyShips = async (page = 1, limit = 10): Promise<ShipsResponse> => {
    const response = await api.get('/my/ships', {
      params: { page, limit },
    })
    return response.data
  }

  static getShip = async (shipSymbol: string): Promise<Ship> => {
    const response = await api.get(`/my/ships/${shipSymbol}`)
    return response.data.data
  }

  static getShipCargo = async (shipSymbol: string) => {
    const response = await api.get(`/my/ships/${shipSymbol}/cargo`)
    return response.data.data
  }

  static getShipNav = async (shipSymbol: string) => {
    const response = await api.get(`/my/ships/${shipSymbol}/nav`)
    return response.data.data
  }
}
