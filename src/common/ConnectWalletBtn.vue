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
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { cropAddress, ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { errors } from '@/errors'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const connect = async () => {
  try {
    if (provider.value.currentProvider) {
      await provider.value.connect()
    } else {
      throw new errors.MetamaskProviderNotFound()
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const connectProviderButtonText = computed(() => {
  return provider.value.isConnected
    ? cropAddress(provider.value.selectedAddress!, 8, 6)
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
