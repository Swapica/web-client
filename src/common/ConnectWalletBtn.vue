<template>
  <app-button
    class="connect-wallet-btn"
    :text="connectProviderButtonText"
    :scheme="provider.isConnected ? 'raised' : 'primary'"
    @focus="isHovered = true"
    @blur="isHovered = false"
    @click="connect"
  >
  </app-button>
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { cropAddress, ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const isHovered = ref(false)

const connect = async () => {
  try {
    if (provider.value.isConnected) {
      provider.value.disconnect()
      return
    }
    await provider.value.connect()
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const connectProviderButtonText = computed(() => {
  return provider.value.isConnected
    ? isHovered.value
      ? t('connect-wallet-btn.disconnect-provider-button')
      : cropAddress(provider.value.selectedAddress!, 8, 6)
    : t('connect-wallet-btn.connect-provider-button')
})
</script>

<style lang="scss" scoped>
.connect-wallet-btn {
  width: toRem(198);
  min-width: toRem(198);
}
</style>
