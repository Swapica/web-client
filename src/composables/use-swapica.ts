import { ref } from 'vue'
import { UseUnrefProvider, Swapica, Swapica__factory, UserOrder } from '@/types'
import { JsonRpcProvider } from '@ethersproject/providers'

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
    const data = await _instance.value?.getUserOrders(address, from, to)
    return data as unknown as UserOrder[]
  }

  return {
    init,
    useSwapica,
    getUserOrders,
  }
}
