import type { Market } from '@/types/market.type'
import { MarketSupplyLevel, MarketActivityLevel, TradeGoodType } from '@/pages/markets/markets.enum'

export function getMarketMock(): Market {
  return {
    symbol: 'X1-TEST-A1',
    exports: [
      {
        symbol: 'PRECIOUS_STONES',
        name: 'Precious Stones',
        description: 'Rare and valuable gems',
      },
    ],
    imports: [
      {
        symbol: 'FOOD',
        name: 'Food',
        description: 'Basic sustenance',
      },
    ],
    exchange: [],
    tradeGoods: [
      {
        symbol: 'PRECIOUS_STONES',
        name: 'Precious Stones',
        description: 'Rare and valuable gems',
        type: TradeGoodType.EXPORT,
        tradeVolume: 100,
        supply: MarketSupplyLevel.MODERATE,
        activity: MarketActivityLevel.STRONG,
        purchasePrice: 1000,
        sellPrice: 1200,
      },
    ],
  }
}
