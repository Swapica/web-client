import { ref } from 'vue'
import {
  UseUnrefProvider,
  Swapica,
  Swapica__factory,
  UserOrder,
  Order,
} from '@/types'
import { JsonRpcProvider } from '@ethersproject/providers'
import { loadTokenInfo } from '@/helpers'
import { useChainsStore } from '@/store'
import { storeToRefs } from 'pinia'

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

  const getUserOrders = async (address: string, from: number, to: number) => {
    const { chainByChainId } = storeToRefs(useChainsStore())

    const response = await _instance.value?.getUserOrders(address, from, to)

    const data = await Promise.all(
      (response as unknown as Order[])?.map(async i => {
        const [tokenToSell, tokenToBuy] = await Promise.all([
          loadTokenInfo(
            'https://goerli.infura.io/v3/5d2d42ec8be94b77a70ff167f9e19396',
            i.tokenToSell,
          ),
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

  return {
    init,
    useSwapica,
    getUserOrders,
  }
}
