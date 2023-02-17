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
  MatchStatusInfo,
  OrderStatusInfo,
} from '@/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { loadMatchStatus, loadOrder, getTokenInfo, isDefined } from '@/helpers'
import { useChainsStore } from '@/store'
import { MatchStatus, OrderStatus } from '@/enums'

export const useSwapica = (
  provider: UseUnrefProvider | JsonRpcProvider,
  address?: string,
) => {
  const _instance = ref<Swapica | undefined>()
  const _instance_rw = ref<Swapica | undefined>()
  if (address) {
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
    const { chainByChainId } = useChainsStore()

    const response = await _instance.value?.getUserOrders(
      address,
      status,
      from,
      to,
    )

    const data = await Promise.all(
      (response as unknown as Order[])?.map(async i => {
        const destChain = chainByChainId(i.destChain.toNumber())
        if (!destChain) return
        const [tokenToSell, tokenToBuy, statuses] = await Promise.all([
          getTokenInfo(network, i.tokenToSell),
          getTokenInfo(destChain, i.tokenToBuy),
          ...(status === OrderStatus.executed
            ? [_getStatusInfo(destChain!, i.id.toNumber())]
            : []),
        ])
        return {
          info: i,
          tokenToSell,
          tokenToBuy,
          ...statuses,
        } as UserOrder
      }),
    )
    return data.filter(isDefined)
  }

  const _getStatusInfo = async (network: ChainResposne, orderId: number) => {
    const orderStatus = await getOrderStatus(orderId)
    const matchStatus = await loadMatchStatus(
      network.chain_params.rpc,
      network.swap_contract,
      orderStatus.executedBy.toNumber(),
    )
    return {
      orderStatus,
      matchStatus,
    }
  }

  const getUserOrdersLength = async (user: string) => {
    return _instance.value?.getUserOrdersLength(user)
  }
  const getOrdersLength = async () => {
    return _instance.value?.getAllOrdersLength()
  }
  const getUserMatchesLength = async (user: string) => {
    return _instance.value?.getUserMatchesLength(user)
  }

  const getOrderStatus = async (id: number) => {
    return _instance.value?.orderStatus(id) as unknown as OrderStatusInfo
  }
  const getMatchStatus = async (id: number) => {
    return _instance.value?.matchStatus(id) as unknown as MatchStatusInfo
  }

  const getOrder = async (id: number, network: ChainResposne) => {
    const order = (await _instance.value?.orders(id)) as unknown as Order
    const { chainByChainId } = useChainsStore()
    const destChain = chainByChainId(order.destChain.toNumber())
    const [tokenToSell, tokenToBuy, orderStatus] = await Promise.all([
      getTokenInfo(network, order.tokenToSell),
      getTokenInfo(destChain!, order.tokenToBuy),
      getOrderStatus(order.id.toNumber()),
    ])
    return {
      info: order,
      tokenToSell,
      tokenToBuy,
      orderStatus,
    } as UserOrder
  }

  const getActiveOrders = async (
    tokenSell: string,
    tokenBuy: string,
    offset: number,
    limit: number,
    network: ChainResposne,
  ) => {
    const { chainByChainId } = useChainsStore()

    const response = await _instance.value?.getAllOrders(offset, limit)

    const data = await Promise.all(
      (response as unknown as Order[])?.map(async i => {
        const destChain = chainByChainId(i.destChain.toNumber())
        if (!destChain) return
        const [tokenToSell, tokenToBuy] = await Promise.all([
          getTokenInfo(network, i.tokenToSell),
          getTokenInfo(destChain, i.tokenToBuy),
        ])
        return {
          info: i,
          tokenToSell,
          tokenToBuy,
        } as UserOrder
      }),
    )
    return data.filter(isDefined)
  }

  const getUserMatchesWithOrder = async (
    address: string,
    from: number,
    to: number,
    status = MatchStatus.awaitingFinalization,
  ) => {
    const response = await _instance.value?.getUserMatches(
      address,
      status,
      from,
      to,
    )
    const { chainByChainId } = useChainsStore()

    const data = await Promise.all(
      (response as unknown as Match[])?.map(async i => {
        const originChain = chainByChainId(i.originChain.toNumber())
        if (!originChain) return
        const order = await loadOrder(
          originChain.chain_params.rpc!,
          originChain.swap_contract!,
          i.originOrderId.toNumber(),
          originChain,
        )
        return {
          info: i,
          order,
        } as UserMatch
      }),
    )
    return data.filter(isDefined)
  }

  const getUserMatches = async (
    address: string,
    offset: number,
    limit: number,
  ) => {
    const response = await _instance.value?.getUserMatches(
      address,
      offset,
      limit,
    )
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
    getOrderStatus,
    getMatchStatus,
    getOrder,
  }
}
