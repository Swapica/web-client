import {
  ChainResposne,
  EthProviderRpcError,
  TokenInfo,
  TxRequestBody,
} from '@/types'
import { errors } from '@/errors'
import { ethers } from 'ethers'
import { EIP1193, EIP1193String, EIP1474 } from '@/enums'
import { mapKeys, get } from 'lodash-es'
import { isMobile, sleep, toCamelCaseDeep } from '@/helpers'
import { useErc20 } from '@/composables/use-erc20'
import { useTokensStore, useWeb3ProvidersStore } from '@/store'
import { config } from '@/config'

export const connectEthAccounts = async (
  provider: ethers.providers.Web3Provider,
) => {
  await provider.send('eth_requestAccounts', [])
}

export async function requestSwitchEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
) {
  await provider.send('wallet_switchEthereumChain', [
    { chainId: ethers.utils.hexValue(chainId) },
  ])
}

export async function requestAddEthChain(
  provider: ethers.providers.Web3Provider,
  chainId: number,
  chainName: string,
  chainRpcUrl: string,
  currencySymbol: string,
  currencyName: string,
  currencyDecimal: number,
  explorerUrl: string,
) {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: ethers.utils.hexValue(chainId),
      chainName,
      rpcUrls: [chainRpcUrl],
      nativeCurrency: {
        name: currencyName,
        symbol: currencySymbol,
        decimals: currencyDecimal,
      },
      blockExplorerUrls: [explorerUrl],
    },
  ])
}

export function handleEthError(error: EthProviderRpcError) {
  const code = get(error, 'error.code', error.code)
  switch (code) {
    case EIP1193.userRejectedRequest:
    case EIP1193String.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest(error.message)
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized(error.message)
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod(error.message)
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected(error.message)
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected(error.message)
    case EIP1474.parseError:
      throw new errors.ProviderParseError(error.message)
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest(error.message)
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound(error.message)
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams(error.message)
    case EIP1474.internalError:
      throw new errors.ProviderInternalError(error.message, {
        cause: error,
      })
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput(error.message, {
        cause: error,
      })
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound(error.message)
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable(error.message)
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected(error.message)
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported(error.message)
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded(error.message)
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported(error.message)
    default:
      throw error
  }
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}

export function normalizeTxBody(txBody: TxRequestBody): TxRequestBody {
  const web3ToEthersTxBodyDiffs = {
    chain: 'chainId',
  }

  const caseNormalizedTxBody = toCamelCaseDeep(txBody) as object
  const propertyNormalizedTxBody = mapKeys(
    caseNormalizedTxBody as object,
    (value, key) => {
      if (key in Object.keys(web3ToEthersTxBodyDiffs)) {
        return get(web3ToEthersTxBodyDiffs, key)
      } else {
        return key
      }
    },
  )

  return propertyNormalizedTxBody as TxRequestBody
}

export async function loadTokenInfo(rpcUrl: string, address: string) {
  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const erc20 = useErc20(rpcProvider, address)
  await erc20.loadDetails()

  return {
    decimals: erc20.decimals.value,
    symbol: erc20.symbol.value,
  } as TokenInfo
}

export async function getTokenInfo(chain: ChainResposne, address: string) {
  if (address === config.NATIVE_TOKEN) {
    const { tokensByChainId } = useTokensStore()
    const token = tokensByChainId(chain.id).find(
      i => i.chain.contract_address === address,
    )
    return {
      decimals: chain?.chain_params.native_decimals,
      symbol: token?.symbol,
    } as TokenInfo
  } else {
    const data = await loadTokenInfo(chain.chain_params.rpc, address)
    return data
  }
}

export async function loadTokenBalance(rpcUrl: string, address: string) {
  const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const { provider } = useWeb3ProvidersStore()

  if (address === config.NATIVE_TOKEN) {
    const balance = await rpcProvider?.getBalance(provider.selectedAddress!)
    return balance?.toString()
  } else {
    const erc20 = useErc20(rpcProvider, address)
    return erc20.getBalanceOf(provider.selectedAddress!)
  }
}

export async function switchNetwork(chain: ChainResposne) {
  const { provider } = useWeb3ProvidersStore()

  try {
    if (provider.isConnected) {
      await provider.switchChain(chain.chain_params.chain_id)
    }
  } catch (error) {
    const e = error as EthProviderRpcError

    if (
      e?.code === 4902 ||
      e?.code === EIP1474.internalError ||
      (isMobile() && !(e instanceof errors.ProviderUserRejectedRequest))
    ) {
      try {
        await provider.addChain(
          chain.chain_params.chain_id,
          chain.name,
          chain.chain_params.rpc,
          chain.chain_params.native_symbol,
          chain.chain_params.native_symbol, // TODO add name
          chain.chain_params.native_decimals,
          chain.chain_params.explorer_url,
        )
        await sleep(1500)
        if (provider.chainId !== chain.chain_params.chain_id) {
          throw new errors.ProviderUserRejectedRequest()
        }
      } catch (e) {
        handleEthError(e as EthProviderRpcError)
      }
    } else {
      handleEthError(e)
    }
  }
}
