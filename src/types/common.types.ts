import { ICON_NAMES } from '@/enums'
import { ethers } from 'ethers'

import {
  DesignatedProvider,
  ChainId,
  TransactionResponse,
  TxRequestBody,
} from '@/types'
import { PROVIDERS } from '@/enums'

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: typeof ICON_NAMES | unknown
}

export interface UseUnrefProvider {
  currentProvider: ethers.providers.Web3Provider | undefined
  currentSigner: ethers.providers.JsonRpcSigner | undefined

  selectedProvider: PROVIDERS | undefined
  chainId: ChainId | undefined
  selectedAddress: string | undefined
  isConnected: boolean

  init: (provider: DesignatedProvider) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchChain: (chainId: ChainId) => Promise<void>
  addChain: (
    chainId: ChainId,
    chainName: string,
    chainRpcUrl: string,
    currencySymbol: string,
    currencyName: string,
    currencyDecimal: number,
    explorerUrl: string,
  ) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
}
