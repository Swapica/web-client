import { BigNumber } from 'ethers'

export type TokenInfo = {
  symbol: string
  decimals: number
}

export type Order = {
  account: string
  tokenToBuy: string
  tokenToSell: string
  amountToBuy: BigNumber
  amountToSell: BigNumber
  destChain: BigNumber
  id: BigNumber
}

export type UserOrder = {
  info: Order
  tokenToBuy: TokenInfo
  tokenToSell: TokenInfo
  matchStatus?: MatchStatusInfo
  orderStatus?: OrderStatusInfo
}

export type Match = {
  creator: string
  tokenToSell: string
  amountToSell: BigNumber
  originChainId: BigNumber
  matchId: BigNumber
  originOrderId: BigNumber
  state: number
}

export type UserMatch = {
  info: Match
  order: UserOrder
}

export type OrderStatusInfo = {
  state: number
  executedBy: BigNumber
  matchSwapica: string
}

export type MatchStatusInfo = {
  state: number
  executedBy: BigNumber
  matchSwapica: string
}
