<template>
  <app-button
    class="connect-wallet-btn"
    :class="{ 'connect-wallet-btn--connected': provider.isConnected }"
    :text="connectProviderButtonText"
    :scheme="provider.isConnected ? 'raised' : 'primary'"
    @click="connect"
  />
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'
import { useWeb3ProvidersStore, useChainsStore } from '@/store'
import { computed } from 'vue'
import {
  cropAddress,
  ErrorHandler,
  sleep,
  switchNetwork,
  isMobile,
} from '@/helpers'
import { useI18n } from 'vue-i18n'
import { errors } from '@/errors'

const { provider } = useWeb3ProvidersStore()
const chainStore = useChainsStore()

const { t } = useI18n({ useScope: 'global' })

const connect = async () => {
  try {
    if (provider.currentProvider) {
      await provider.connect()
      await sleep(1000)
      if (chainStore.selectedChain) {
        await switchNetwork(chainStore.selectedChain!)
      }
    } else if (isMobile()) {
      window.open(
        `https://metamask.app.link/dapp/${window.location.host}`,
        '_blank',
        'noopener',
      )
    } else {
      throw new errors.MetamaskProviderNotFound()
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const connectProviderButtonText = computed(() => {
  return provider.isConnected
    ? cropAddress(provider.selectedAddress!, 8, 6)
    : t('connect-wallet-btn.connect-provider-button')
})
</script>

<style lang="scss" scoped>
.connect-wallet-btn {
  width: toRem(198);
  min-width: toRem(198);

  &--connected {
    cursor: default;
  }
}
</style>
