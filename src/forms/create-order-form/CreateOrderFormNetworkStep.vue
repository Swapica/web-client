<template>
  <form class="create-order-form-network-step" @submit.prevent="handleNext">
    <h4 class="create-order-form-network-step__title">
      {{ $t('create-order-form-network-step.title') }}
    </h4>
    <p class="create-order-form-network-step__desc">
      {{ $t('create-order-form-network-step.description') }}
    </p>
    <select-field
      class="create-order-form-network-step__sell-network-select"
      v-model="form.networkSell"
      scheme="primary"
      :is-error-message-shown="false"
      :label="$t('create-order-form-network-step.network-to-sell-lbl')"
      :value-options="networkSellChains"
      :disabled="isDisabled"
      :error-message="getFieldErrorMessage('networkSell')"
      @blur="touchField('networkSell')"
    />
    <select-field
      v-model="form.networkBuy"
      scheme="primary"
      :is-error-message-shown="false"
      :value-options="networkBuyChains"
      :disabled="isDisabled"
      :label="$t('create-order-form-network-step.network-to-buy-lbl')"
      :error-message="getFieldErrorMessage('networkBuy')"
      @blur="touchField('networkBuy')"
    />

    <div class="create-order-form-network-step__actions">
      <app-button
        class="create-order-form-network-step__action"
        :text="$t('create-order-form-network-step.cancel-btn')"
        :disabled="isDisabled"
        scheme="secondary"
        @click="emit('cancel')"
      />
      <app-button
        class="create-order-form-network-step__action"
        :text="$t('create-order-form-network-step.next-btn')"
        :disabled="isDisabled"
        scheme="primary"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { SelectField } from '@/fields'
import { useChainsStore } from '@/store'
import { UseCreateOrderForm } from '@/types'
import { computed, toRefs } from 'vue'
import { required } from '@/validators'
import { CHAIN_TYPES } from '@/enums'

const props = defineProps<{
  former: UseCreateOrderForm
  isDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'next'): void
}>()

const { form } = toRefs(props.former)

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    networkSell: { required },
    networkBuy: { required },
  },
)

const { chains, chainById } = useChainsStore()

const networkSellChains = computed(() => getNetworkList(form.value.networkBuy))
const networkBuyChains = computed(() => getNetworkList(form.value.networkSell))

const getNetworkList = (network: string) => {
  const chainList = chains.map(i => ({
    label: i.name,
    value: i.id,
    imageUrl: i.icon,
    type: i.chain_params.chain_type,
  }))

  return chainList.filter(i => {
    const networkInfo = chainById(network)

    return (
      i.type === CHAIN_TYPES.testnet ||
      i.type !== networkInfo?.chain_params.chain_type
    )
  })
}

const handleNext = () => {
  if (!isFormValid()) return
  emit('next')
}
</script>

<style lang="scss" scoped>
.create-order-form-network-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(368);
  width: 100%;
}

.create-order-form-network-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(8) 0 toRem(12);
  }
}

.create-order-form-network-step__desc {
  margin-bottom: toRem(24);

  @include respond-to(tablet) {
    margin-bottom: toRem(16);
  }
}

.create-order-form-network-step__sell-network-select {
  margin-bottom: toRem(16);
}

.create-order-form-network-step__actions {
  margin-top: toRem(24);
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: toRem(32);

  @include respond-to(tablet) {
    gap: toRem(16);
  }
}

.create-order-form-network-step__action {
  width: 100%;
}
</style>
