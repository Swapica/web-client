<template>
  <form class="match-order-form" @submit.prevent>
    <stepper-indicator :steps="steps" :current-step-idx="currentIdx" />
    <change-network-step
      v-if="currentStep.name === STEPS.matchChangeNetwork"
      :network="networkBuy!"
      @cancel="close"
      @changed="onNext"
    >
      <i18n-t
        keypath="match-order-form.change-match-network-msg"
        tag="p"
        class="match-order-form__change-network-msg"
      >
        <template #network>
          {{ networkBuy?.name }}
        </template>
        <template #networkBold>
          <span class="match-order-form__network-lbl">
            {{ networkBuy?.name }}
          </span>
        </template>
      </i18n-t>
    </change-network-step>
    <match-order-form-match-step
      v-if="currentStep.name === STEPS.match"
      @cancel="close"
      @changed="onNext"
    />
    <approve-step
      v-if="currentStep.name === STEPS.approve"
      @approve="handleApprove"
    >
      <i18n-t
        keypath="match-order-form.approve-msg"
        tag="p"
        class="match-order-form__approve-msg"
      >
        <template #token>
          <span class="match-order-form__approve-token">
            {{ $t('match-order-form.approve-msg-token') }}
          </span>
        </template>
      </i18n-t>
    </approve-step>
    <confirmation-step v-if="currentStep.name === STEPS.confirmation" />
  </form>
</template>

<script lang="ts" setup>
import { useStepper } from '@/composables'
import {
  StepperIndicator,
  ConfirmationStep,
  ApproveStep,
  ChangeNetworkStep,
} from '@/common'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { callers } from '@/api'
import { ChainResposne, TxResposne, UserOrder } from '@/types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MatchOrderFormMatchStep from '@/forms/match-order-form/MatchOrderFormMatchStep.vue'

enum STEPS {
  matchChangeNetwork = 'match-change-network',
  match = 'match',
  confirmation = 'confirmation',
  approve = 'approve',
}

const props = defineProps<{
  order: UserOrder
  networkSell: ChainResposne
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
const { chainByChainId } = storeToRefs(useChainsStore())

const networkBuy = computed(() =>
  chainByChainId.value(props.order.info.destChain.toNumber()),
)

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { t } = useI18n({ useScope: 'global' })

const { currentStep, steps, currentIdx, forward, back, toStep } = useStepper([
  STEPS.matchChangeNetwork,
  STEPS.match,
  { name: STEPS.approve, isHidden: true },
  STEPS.confirmation,
])

if (provider.value.chainId === networkBuy.value?.chain_params.chain_id) {
  toStep(STEPS.match)
}
const approveTx = ref<TxResposne | null>(null)

const onNext = () => {
  switch (currentStep.value.name) {
    case STEPS.match:
      match()
      break
    default:
      forward()
  }
}

const close = () => {
  emit('close')
}

const match = async () => {
  toStep(STEPS.confirmation)
  try {
    await checkApprove(networkBuy.value?.id, props.order.info.tokenToBuy)
    if (approveTx.value) {
      toStep(STEPS.approve)
      return
    }

    await matchOrder()
  } catch (e) {
    toStep(STEPS.match)
    ErrorHandler.process(e)
  }
}

const checkApprove = async (networkId: string, tokenAddrs: string) => {
  const { data } = await callers.approve(
    provider.value.selectedAddress!,
    networkId,
    tokenAddrs,
  )
  approveTx.value = data || null
}

const handleApprove = async () => {
  toStep(STEPS.confirmation)
  try {
    await approveToken()
    await matchOrder()
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

const matchOrder = async () => {
  try {
    const { data } = await former.matchOrder()
    await provider.value.signAndSendTx(data.tx_body)
    Bus.emit(Bus.eventList.offermatchd)
    Bus.success(t('match-order-form.matchd-msg'))
    emit('close')
  } catch (e) {
    toStep(STEPS.tokens)
    throw e
  }
}

const switchChain = async () => {
  try {
    await switchNetwork(former.networkSell.value!)
    forward()
  } catch (e) {
    ErrorHandler.process(e)
  }
}
</script>
<style lang="scss" scoped>
.match-order-form__approve-msg {
  text-align: center;
}

.match-order-form__approve-token {
  font-size: inherit;
  color: var(--text-primary-dark);
}

.match-order-form__change-network-msg {
  text-align: center;
}

.match-order-form__network-lbl {
  color: var(--text-primary-dark);
}
</style>
