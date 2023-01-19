import { ethers } from 'ethers'

export interface EthereumProvider extends ethers.providers.ExternalProvider {
  providers?: unknown[]
}

export type EthProviderRpcError = {
  message: string
  code: number | string
  error?: EthError
  reason: string
}

export type EthError = {
  message: string
  code: number | string
  data?: EthError
}
