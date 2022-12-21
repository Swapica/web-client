import { BigNumber } from 'ethers'

export type UserOrder = {
  account: string
  tokenToBuy: string
  tokenToSell: string
  amountToBuy: BigNumber
  amountToSell: BigNumber
  destChain: BigNumber
  id: BigNumber
}
