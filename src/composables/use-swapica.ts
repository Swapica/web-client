import { ref } from 'vue'
import {
  UseUnrefProvider,
  Swapica,
  Swapica__factory,
  UserOrder,
  Order,
  ChainResposne,
  UserMatch,
  Match,
} from '@/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { loadTokenInfo } from '@/helpers'
import { useChainsStore } from '@/store'
import { storeToRefs } from 'pinia'
import { OrderStatus } from '@/enums'

export const useSwapica = (provider: UseUnrefProvider, address?: string) => {
  const _instance = ref<Swapica | undefined>()
  const _instance_rw = ref<Swapica | undefined>()
  if (address && provider.currentProvider && provider.currentSigner) {
    _instance.value = Swapica__factory.connect(
      address,
      provider.currentProvider,
    )
    _instance_rw.value = Swapica__factory.connect(
      address,
      provider.currentSigner,
    )
  }

  const init = (
    address: string,
    provider: UseUnrefProvider | JsonRpcProvider,
  ) => {
    _instance.value = Swapica__factory.connect(
      address,
      provider && 'currentSigner' in provider
        ? provider.currentProvider!
        : provider!,
    )
    if (provider && 'currentSigner' in provider) {
      _instance_rw.value = Swapica__factory.connect(
        address,
        provider.currentSigner!,
      )
    }
  }

  const getUserOrders = async (
    address: string,
    from: number,
    to: number,
    network: ChainResposne,
    status = OrderStatus.awaitingMatch,
  ) => {
    const { chainByChainId } = storeToRefs(useChainsStore())

    const response = await _instance.value?.getUserOrders(
      address,
      status,
      from,
      to,
    )

    const data = await Promise.all(
      (response as unknown as Order[])?.map(async i => {
        const [tokenToSell, tokenToBuy] = await Promise.all([
          loadTokenInfo(network.chain_params.rpc, i.tokenToSell),
          loadTokenInfo(
            chainByChainId.value(i.destChain.toNumber())?.chain_params.rpc!,
            i.tokenToBuy,
          ),
        ])
        return {
          info: i,
          tokenToSell,
          tokenToBuy,
        } as UserOrder
      }),
    )
    return data
  }

  const getUserOrdersLength = async (user: string) => {
    return _instance.value?.getUserOrdersLength(user)
  }
  const getOrdersLength = async () => {
    return _instance.value?.getOrdersLength()
  }
  const getUserMatchesLength = async (user: string) => {
    return _instance.value?.getUserMatchesLength(user)
  }

  const getActiveOrders = async (
    tokenSell: string,
    tokenBuy: string,
    from: number,
    to: number,
    network: ChainResposne,
  ) => {
    const { chainByChainId } = storeToRefs(useChainsStore())

    const response = await _instance.value?.getActiveOrders(
      tokenSell,
      tokenBuy,
      from,
      to,
    )

    const data = await Promise.all(
      (response as unknown as Order[])?.map(async i => {
        const [tokenToSell, tokenToBuy] = await Promise.all([
          loadTokenInfo(network.chain_params.rpc, i.tokenToSell),
          loadTokenInfo(
            chainByChainId.value(i.destChain.toNumber())?.chain_params.rpc!,
            i.tokenToBuy,
          ),
        ])
        return {
          info: i,
          tokenToSell,
          tokenToBuy,
        } as UserOrder
      }),
    )
    return data
  }

  const getUserMatchesWithOrder = async (
    address: string,
    from: number,
    to: number,
    network: ChainResposne,
  ) => {
    const response = await _instance.value?.getUserMatches(address, 2, from, to)

    const data = await Promise.all(
      (response as unknown as Match[])?.map(async i => {
        const activeOrders = await getActiveOrders(
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          i.originOrderId.toNumber(),
          i.originOrderId.toNumber() + 1,
          network,
        )
        return {
          info: i,
          order: activeOrders[0],
        } as UserMatch
      }),
    )
    return data
  }

  const getUserMatches = async (address: string, from: number, to: number) => {
    const response = await _instance.value?.getUserMatches(address, 2, from, to)
    return response as unknown as Match[]
  }

  return {
    init,
    useSwapica,
    getUserOrders,
    getActiveOrders,
    getUserOrdersLength,
    getOrdersLength,
    getUserMatchesLength,
    getUserMatchesWithOrder,
    getUserMatches,
  }
}
