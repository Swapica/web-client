import { BigNumber } from 'ethers'

export type TokenInfo = {
  symbol: string
  decimals: number
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
