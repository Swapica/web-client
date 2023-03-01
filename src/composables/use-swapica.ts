import { ref } from 'vue'
import { UseUnrefProvider, Swapica, Swapica__factory, Match } from '@/types'
import { JsonRpcProvider } from '@ethersproject/providers'

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
  const getUserMatchesLength = async (user: string) => {
    return _instance.value?.getUserMatchesLength(user)
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
    getUserMatchesLength,
    getUserMatches,
  }
}
