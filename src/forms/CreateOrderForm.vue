<template>
  <form class="create-order-form" @submit.prevent>
    <stepper-indicator
      :total-steps="totalStepsVisible"
      :current-step-idx="currentIdx"
    />
    <create-order-form-network-step v-if="currentStep.name === 'network'" />
    <create-order-form-tokens-step v-if="currentStep.name === 'tokens'" />
  </form>
</template>

<script lang="ts" setup>
import CreateOrderFormNetworkStep from '@/forms/create-order-form/CreateOrderFormNetworkStep.vue'
import CreateOrderFormTokensStep from '@/forms/create-order-form/CreateOrderFormTokensStep.vue'
import { useStepper } from '@/composables'
import { StepperIndicator } from '@/common'

const { currentStep, totalStepsVisible, currentIdx } = useStepper([
  'network',
  'tokens',
  'confirmation',
  'approve',
])
</script>

<style lang="scss" scoped></style>
