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
}
