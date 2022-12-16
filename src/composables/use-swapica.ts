import { ref } from 'vue'
import { UseProvider, Swapica, Swapica__factory } from '@/types'

export const useSwapica = (provider: UseProvider, address?: string) => {
  const _instance = ref<Swapica | undefined>()
  const _instance_rw = ref<Swapica | undefined>()
  if (
    address &&
    provider.currentProvider.value &&
    provider.currentSigner.value
  ) {
    _instance.value = Swapica__factory.connect(
      address,
      provider.currentProvider.value,
    )
    _instance_rw.value = Swapica__factory.connect(
      address,
      provider.currentSigner.value,
    )
  }

  const init = (address: string) => {
    if (address && provider.currentProvider && provider.currentSigner) {
      _instance.value = Swapica__factory.connect(
        address,
        provider.currentProvider.value!,
      )
      _instance_rw.value = Swapica__factory.connect(
        address,
        provider.currentSigner.value!,
      )
    }
  }

  const getOrders = async () => {
    return _instance.value?.orders(1)
  }

  return {
    init,
    useSwapica,
    getOrders,
  }
}
