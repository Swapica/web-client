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
      :is-disabled="isFormDisabled"
      @back="onBack"
      @next="onNext"
    />

    <confirmation-step v-if="currentStep.name === 'confirmation'" />
  </form>
</template>

<script lang="ts" setup>
import CreateOrderFormNetworkStep from '@/forms/create-order-form/CreateOrderFormNetworkStep.vue'
import CreateOrderFormTokensStep from '@/forms/create-order-form/CreateOrderFormTokensStep.vue'
import { useCreateOrderForm, useForm, useStepper } from '@/composables'
import { StepperIndicator, ConfirmationStep } from '@/common'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { callers } from '@/api'
import { TxResposne } from '@/types'
import { ref } from 'vue'

enum STEPS {
  network = 'network',
  tokens = 'tokens',
  confirmation = 'confirmation',
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const former = useCreateOrderForm()
const { isFormDisabled, disableForm, enableForm } = useForm()
const { currentStep, totalStepsVisible, currentIdx, forward, back, toStep } =
  useStepper([STEPS.network, STEPS.tokens, STEPS.confirmation])

const approveTx = ref<TxResposne | null>(null)

const onBack = () => {
  switch (currentStep.value.name) {
    default:
      back()
  }
}

const onNext = () => {
  switch (currentStep.value.name) {
    case STEPS.tokens:
      submit()
      break
    default:
      forward()
  }
}

const submit = async () => {
  forward()
  disableForm()
  try {
    await checkApprove()
    if (approveTx.value) {
      await approve()
    } else {
      const { data } = await former.createOrder()
      await provider.value.signAndSendTx(data.tx_body)
      emit('close')
    }
  } catch (e) {
    toStep(STEPS.tokens)
    ErrorHandler.process(e)
  }
  enableForm()
}

const checkApprove = async () => {
  const { data } = await callers.post<TxResposne>('/v1/approve', {
    data: {
      sender: provider.value.selectedAddress,
      chain_id: former.networkSell.value.id,
      token_address: former.form.tokenSell,
      token_type: 'erc20',
    },
  })
  approveTx.value = data || null
}
const approve = async () => {
  try {
    await provider.value.signAndSendTx(approveTx.value?.tx_body)
  } catch (e) {
    // toStep(STEPS.approve)
    ErrorHandler.process(e)
  }
}
</script>
