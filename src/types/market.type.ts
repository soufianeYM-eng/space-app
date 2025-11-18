import {
  MarketSupplyLevel,
  MarketActivityLevel,
  TradeGoodType,
} from '@/pages/markets/markets.enum'

export interface Market {
  symbol: string
  exports: TradeGood[]
  imports: TradeGood[]
  exchange: TradeGood[]
  tradeGoods?: MarketTradeGood[]
}

export interface TradeGood {
  symbol: string
  name: string
  description: string
}

export interface MarketTradeGood extends TradeGood {
  type?: TradeGoodType
  tradeVolume: number
  supply: MarketSupplyLevel
  activity?: MarketActivityLevel
  purchasePrice: number
  sellPrice: number
}
