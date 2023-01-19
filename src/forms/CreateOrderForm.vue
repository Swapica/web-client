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
    >
      <i18n-t
        keypath="create-order-form.approve-msg"
        tag="p"
        class="create-order-form__approve-msg"
      >
        <template #token>
          <span class="create-order-form__approve-token">
            {{ $t('create-order-form.approve-msg-token') }}
          </span>
        </template>
      </i18n-t>
    </approve-step>
    <confirmation-step
      v-if="currentStep.name === STEPS.confirmation"
      :title="
        isApproving
          ? $t('create-order-form.approve-confirmation-title')
          : $t('create-order-form.create-confirmation-title')
      "
      :description="
        isApproving
          ? $t('create-order-form.approve-confirmation-desc')
          : $t('create-order-form.create-confirmation-desc')
      "
    />
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
import { config } from '@/config'

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
const isApproving = ref(false)

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
  if (former.form.tokenSell === config.NATIVE_TOKEN) return

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
  isApproving.value = true
  try {
    await provider.value.signAndSendTx(approveTx.value?.tx_body)
  } catch (e) {
    toStep(STEPS.approve)
    throw e
  }
  isApproving.value = false
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
<style lang="scss" scoped>
.create-order-form__approve-msg {
  text-align: center;
}

.create-order-form__approve-token {
  font-size: inherit;
  color: var(--text-primary-dark);
}
</style>
