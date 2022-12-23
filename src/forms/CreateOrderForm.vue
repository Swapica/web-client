<template>
  <form class="create-order-form" @submit.prevent>
    <stepper-indicator :steps="steps" :current-step-idx="currentIdx" />
    <create-order-form-network-step
      v-if="currentStep.name === STEPS.network"
      :former="former"
      :is-disabled="isFormDisabled"
      @cancel="emit('close')"
      @next="onNext"
    />
    <create-order-form-tokens-step
      v-if="currentStep.name === STEPS.tokens"
      :former="former"
      :is-disabled="isFormDisabled"
      @back="onBack"
      @next="onNext"
    />

    <approve-step
      v-if="currentStep.name === STEPS.approve"
      @back="onBack"
      @approve="handleApprove"
    />
    <confirmation-step v-if="currentStep.name === STEPS.confirmation" />
  </form>
</template>

<script lang="ts" setup>
import CreateOrderFormNetworkStep from '@/forms/create-order-form/CreateOrderFormNetworkStep.vue'
import CreateOrderFormTokensStep from '@/forms/create-order-form/CreateOrderFormTokensStep.vue'
import { useCreateOrderForm, useForm, useStepper } from '@/composables'
import { StepperIndicator, ConfirmationStep, ApproveStep } from '@/common'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { callers } from '@/api'
import { TxResposne } from '@/types'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

enum STEPS {
  network = 'network',
  tokens = 'tokens',
  confirmation = 'confirmation',
  approve = 'approve',
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const former = useCreateOrderForm()
const { isFormDisabled, disableForm, enableForm } = useForm()
const { currentStep, steps, currentIdx, forward, back, toStep } = useStepper([
  STEPS.network,
  STEPS.tokens,
  { name: STEPS.approve, isHidden: true },
  STEPS.confirmation,
])

const approveTx = ref<TxResposne | null>(null)

const onBack = () => {
  switch (currentStep.value.name) {
    default:
      back()
  }
}

const onNext = () => {
  switch (currentStep.value.name) {
    case STEPS.network:
      switchChain()
      break
    case STEPS.tokens:
      submit()
      break
    default:
      forward()
  }
}

const submit = async () => {
  toStep(STEPS.confirmation)
  try {
    await checkApprove()
    if (approveTx.value) {
      toStep(STEPS.approve)
      return
    }

    await createOrder()
  } catch (e) {
    toStep(STEPS.tokens)
    ErrorHandler.process(e)
  }
}

const checkApprove = async () => {
  const { data } = await callers.approve(
    provider.value.selectedAddress!,
    former.networkSell.value?.id!,
    former.form.tokenSell,
  )
  approveTx.value = data || null
}

const handleApprove = async () => {
  toStep(STEPS.confirmation)
  try {
    await approveToken()
    await createOrder()
  } catch (e) {
    ErrorHandler.process(e)
  }
}
const approveToken = async () => {
  try {
    await provider.value.signAndSendTx(approveTx.value?.tx_body)
  } catch (e) {
    toStep(STEPS.approve)
    throw e
  }
}

const createOrder = async () => {
  try {
    const { data } = await former.createOrder()
    await provider.value.signAndSendTx(data.tx_body)
    Bus.emit(Bus.eventList.offerCreated)
    Bus.success(t('create-order-form.created-msg'))
    emit('close')
  } catch (e) {
    toStep(STEPS.tokens)
    throw e
  }
}

const switchChain = async () => {
  disableForm()
  try {
    await switchNetwork(former.networkSell.value!)
    forward()
  } catch (e) {
    ErrorHandler.process(e)
  }
  enableForm()
}
</script>
