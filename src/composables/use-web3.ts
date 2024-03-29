import { computed, ref } from 'vue'
import { sleep } from '@/helpers'
import { PROVIDERS, PROVIDERS_CHECKS } from '@/enums'
import { DesignatedProvider, ProviderInstance } from '@/types'

export const useWeb3 = () => {
  const providers = ref<DesignatedProvider[]>([])

  const _browserProviders = ref<ProviderInstance[]>([])

  const isEnabled = computed(() => providers.value.length)

  const init = async () => {
    await sleep(500)
    detectProvidersInBrowser()
    await _defineProviders()
  }

  const detectProvidersInBrowser = () => {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined
    _browserProviders.value = [...(ethProviders ? ethProviders : [])]
  }
  const _defineProviders = async () => {
    if (_browserProviders.value.length) {
      await handleProviders()
    } else {
      await sleep(3000)
      await handleProviders()
    }

    async function handleProviders() {
      if (!_browserProviders.value.length) return
      providers.value = designateBrowserProviders()
    }
  }

  const designateBrowserProviders = (): DesignatedProvider[] => {
    if (!_browserProviders.value.length) return []

    const designatedProviders = _browserProviders.value.map(el => {
      const appropriatedProviderName: PROVIDERS = getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        instance: el,
      } as DesignatedProvider
    })

    return designatedProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    )
  }

  const getAppropriateProviderName = (
    provider: ProviderInstance,
  ): PROVIDERS => {
    const providerName = Object.entries(PROVIDERS_CHECKS).find(el => {
      const [, value] = el

      return ((<unknown>provider) as { [key in PROVIDERS_CHECKS]: boolean })[
        value
      ]
    })

    return (
      ((providerName && providerName[0]) as PROVIDERS) || PROVIDERS.fallback
    )
  }

  return {
    providers,

    isEnabled,

    init,
  }
}
