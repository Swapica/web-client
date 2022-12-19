<template>
  <modal
    class="connect-wallet-modal"
    :is-shown="isShown"
    @update:is-shown="close"
  >
    <h4>{{ $t('connect-wallet-modal.title') }}</h4>
    <p class="connect-wallet-modal__desc">
      {{ $t('connect-wallet-modal.desc') }}
    </p>
    <app-button
      class="connect-wallet-modal__connect-btn"
      scheme="select"
      :text="$t('connect-wallet-modal.metamask')"
      :icon-left="$icons.metamask"
      @click="connect(PROVIDERS.metamask)"
    />
    <app-button
      class="connect-wallet-modal__connect-btn"
      scheme="select"
      :text="$t('connect-wallet-modal.wallet-connect')"
      :icon-left="$icons.walletConnect"
      @click="connect(PROVIDERS.walletConnect)"
    />
  </modal>
</template>

<script lang="ts" setup>
import { Modal, AppButton } from '@/common'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { PROVIDERS } from '@/enums'

defineProps<{
  isShown: boolean
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()

const web3Store = useWeb3ProvidersStore()

const close = () => emit('update:is-shown', false)

const connect = async (providerName: PROVIDERS) => {
  try {
    const provider = web3Store.providers.find(
      provider => provider.name === providerName,
    )

    if (provider) {
      await web3Store.provider.init(provider)
      await web3Store.provider.connect()
      close()
    } else {
      throw new Error('Provider not found')
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
}
</script>

<style lang="scss" scoped>
.connect-wallet-modal {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.modal__pane) {
    max-width: toRem(431);
    width: 100%;
    padding: toRem(24) toRem(33) toRem(43) toRem(35);
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

.connect-wallet-modal__desc {
  text-align: center;
  margin: toRem(12) 0 toRem(20);
  max-width: toRem(298);
  width: 100%;
}

.connect-wallet-modal__connect-btn {
  --button-icon-size: #{toRem(32)};

  gap: toRem(8);
  width: 100%;
  justify-content: flex-start;

  &:not(:last-child) {
    margin-bottom: toRem(8);
  }
}
</style>
