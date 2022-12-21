<template>
  <form class="create-order-form" @submit.prevent>
    <stepper-indicator
      :total-steps="totalStepsVisible"
      :current-step-idx="currentIdx"
    />
    <create-order-form-network-step
      v-if="currentStep.name === 'network'"
      :former="former"
      @cancel="emit('close')"
      @next="onNext"
    />
    <create-order-form-tokens-step
      v-if="currentStep.name === 'tokens'"
      :former="former"
      @back="onBack"
      @next="onNext"
    />

    <confirmation-step v-if="currentStep.name === 'confirmation'" />
  </form>
</template>

<script lang="ts" setup>
import CreateOrderFormNetworkStep from '@/forms/create-order-form/CreateOrderFormNetworkStep.vue'
import CreateOrderFormTokensStep from '@/forms/create-order-form/CreateOrderFormTokensStep.vue'
import { useCreateOrderForm, useStepper } from '@/composables'
import { StepperIndicator, ConfirmationStep } from '@/common'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const former = useCreateOrderForm()

const { currentStep, totalStepsVisible, currentIdx, forward, back } =
  useStepper(['network', 'tokens', 'confirmation'], 'tokens')

const onBack = () => {
  switch (currentStep.value.name) {
    default:
      back()
  }
}

const onNext = () => {
  switch (currentStep.value.name) {
    default:
      forward()
  }
}
</script>

<style lang="scss" scoped></style>
