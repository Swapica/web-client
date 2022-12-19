import { ref } from 'vue'
import { UseUnrefProvider, Swapica, Swapica__factory } from '@/types'

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

  const init = (address: string) => {
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
  }

  const getOrders = async (address: string, from: number, to: number) => {
    return _instance_rw.value?.getUserOrders(address, from, to)
  }

  return {
    init,
    useSwapica,
    getOrders,
  }
}
