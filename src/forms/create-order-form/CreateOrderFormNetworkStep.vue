<template>
  <form class="create-order-form-network-step" @submit.prevent>
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
      :label="$t('create-order-form-network-step.network-to-sell-lbl')"
      :value-options="chains"
      :error-message="getFieldErrorMessage('networkSell')"
      @blur="touchField('networkSell')"
    />
    <select-field
      v-model="form.networkBuy"
      scheme="primary"
      :value-options="chains"
      :label="$t('create-order-form-network-step.network-to-buy-lbl')"
      :error-message="getFieldErrorMessage('networkBuy')"
      @blur="touchField('networkBuy')"
    />

    <div class="create-order-form-network-step__actions">
      <app-button
        class="create-order-form-network-step__action"
        :text="$t('create-order-form-network-step.cancel-btn')"
        scheme="secondary"
        @click="emit('cancel')"
      />
      <app-button
        class="create-order-form-network-step__action"
        :text="$t('create-order-form-network-step.next-btn')"
        scheme="primary"
        @click="handleNext"
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

const props = defineProps<{
  former: UseCreateOrderForm
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

const chainStore = useChainsStore()
const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.chain_params.chain_id,
    imageUrl: i.icon,
  })),
)

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
}

.create-order-form-network-step__action {
  width: 100%;
}
</style>
