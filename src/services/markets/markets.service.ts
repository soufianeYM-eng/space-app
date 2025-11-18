import api from '@/api'
import type { Market } from '@/types/market.type'

export class MarketsService {
  static getMarket = async (systemSymbol: string, waypointSymbol: string): Promise<Market> => {
    const response = await api.get(`/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`)
    return response.data.data
  }

  static purchaseGoods = async (shipSymbol: string, tradeSymbol: string, units: number) => {
    const response = await api.post(`/my/ships/${shipSymbol}/purchase`, {
      symbol: tradeSymbol,
      units,
    })
    return response.data.data
  }

  static sellGoods = async (shipSymbol: string, tradeSymbol: string, units: number) => {
    const response = await api.post(`/my/ships/${shipSymbol}/sell`, {
      symbol: tradeSymbol,
      units,
    })
    return response.data.data
  }
}
