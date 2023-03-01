<template>
  <form class="match-order-form" @submit.prevent>
    <stepper-indicator :steps="steps" :current-step-idx="currentIdx" />
    <change-network-step
      v-if="currentStep.name === STEPS.matchChangeNetwork"
      :network="order.destination_chain!"
      @cancel="close"
      @changed="onNext"
    >
      <i18n-t
        keypath="match-order-form.change-match-network-msg"
        tag="p"
        class="match-order-form__change-network-msg"
      >
        <template #network>
          {{ order.src_chain?.name }}
        </template>
        <template #networkBold>
          <span class="match-order-form__network-lbl">
            {{ order.destination_chain?.name }}
          </span>
        </template>
      </i18n-t>
    </change-network-step>
    <match-order-form-match-step
      v-if="currentStep.name === STEPS.match"
      :order="order"
      @cancel="close"
      @confirm="onNext"
    />
    <approve-step
      v-if="currentStep.name === STEPS.approveBuyToken"
      :back-btn-text="$t('match-order-form.cancel-btn')"
      @back="close"
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
    <confirmation-step
      v-if="currentStep.name === STEPS.confirmationMatch"
      :title="
        isApproving
          ? $t('match-order-form.approve-confirmation-title')
          : $t('match-order-form.match-confirmation-title')
      "
      :description="
        isApproving
          ? $t('match-order-form.approve-confirmation-desc')
          : $t('match-order-form.match-confirmation-desc')
      "
    />
    <change-network-step
      v-if="currentStep.name === STEPS.claimChangeNetwork"
      :network="order.src_chain!"
      @cancel="close"
      @changed="onNext"
    >
      <i18n-t
        keypath="match-order-form.change-claim-network-msg"
        tag="p"
        class="match-order-form__change-network-msg"
      >
        <template #network>
          {{ order.src_chain?.name }}
        </template>
        <template #networkBold>
          <span class="match-order-form__network-lbl">
            {{ order.src_chain?.name }}
          </span>
        </template>
      </i18n-t>
    </change-network-step>
    <match-order-form-claim-step
      v-if="currentStep.name === STEPS.claim"
      :order="order"
      @cancel="close"
      @claim="onNext"
    />
    <confirmation-step
      v-if="currentStep.name === STEPS.confirmationClaim"
      :title="$t('match-order-form.claim-confirmation-title')"
      :description="$t('match-order-form.claim-confirmation-desc')"
    />
  </form>
</template>

<script lang="ts" setup>
import { useStepper, useSwapica } from '@/composables'
import {
  StepperIndicator,
  ConfirmationStep,
  ApproveStep,
  ChangeNetworkStep,
} from '@/common'
import { Bus, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { callers } from '@/api'
import { TxResposne, Order } from '@/types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MatchOrderFormMatchStep from '@/forms/match-order-form/MatchOrderFormMatchStep.vue'
import MatchOrderFormClaimStep from '@/forms/match-order-form/MatchOrderFormClaimStep.vue'
import { ethers } from 'ethers'
import { config } from '@/config'

enum STEPS {
  matchChangeNetwork = 'match-change-network',
  claimChangeNetwork = 'claim-change-network',
  match = 'match',
  claim = 'claim',
  confirmationMatch = 'confirmation-match',
  approveBuyToken = 'approve-buy-token',
  confirmationClaim = 'confirmation-claim',
}

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { provider } = useWeb3ProvidersStore()
const swapicaContract = useSwapica(provider)

const { t } = useI18n({ useScope: 'global' })

const isValidChangeMatchNetwork = computed(
  () =>
    provider.chainId === props.order.destination_chain?.chain_params.chain_id,
)

const { currentStep, steps, currentIdx, forward, toStep } = useStepper([
  {
    name: STEPS.matchChangeNetwork,
    isHidden: isValidChangeMatchNetwork.value,
  },
  STEPS.match,
  { name: STEPS.approveBuyToken, isHidden: true },
  STEPS.confirmationMatch,
  STEPS.claimChangeNetwork,
  STEPS.claim,
  STEPS.confirmationClaim,
])

if (isValidChangeMatchNetwork.value) {
  toStep(STEPS.match)
}
const approveTx = ref<TxResposne | null>(null)
const isApproving = ref(false)

const onNext = () => {
  switch (currentStep.value.name) {
    case STEPS.match:
      match()
      break
    case STEPS.claim:
      claim()
      break
    default:
      forward()
  }
}

const close = () => {
  emit('close')
}

const match = async () => {
  toStep(STEPS.confirmationMatch)
  try {
    await checkApprove(
      props.order.destination_chain?.id!,
      props.order.token_to_buy.address,
    )
    if (approveTx.value) {
      toStep(STEPS.approveBuyToken)
      return
    }

    await matchOrder()
  } catch (e) {
    toStep(STEPS.match)
    ErrorHandler.process(e)
  }
}

const checkApprove = async (networkId: string, tokenAddrs: string) => {
  if (tokenAddrs === config.NATIVE_TOKEN) return

  const { data } = await callers.approve(
    provider.selectedAddress!,
    networkId,
    tokenAddrs,
  )
  approveTx.value = data || null
}

const handleApprove = async () => {
  toStep(STEPS.confirmationMatch)
  try {
    await approveToken()
    await matchOrder()
  } catch (e) {
    ErrorHandler.process(e)
  }
}
const approveToken = async () => {
  isApproving.value = true

  try {
    await provider.signAndSendTx(approveTx.value?.tx_body)
  } catch (e) {
    toStep(STEPS.approveBuyToken)
    throw e
  }
  isApproving.value = false
}

const matchOrder = async () => {
  try {
    const { data } = await callers.post<TxResposne>('/v1/create/match', {
      data: {
        dest_chain: props.order.destination_chain?.id,
        order_id: props.order.order_id,
        src_chain: props.order.src_chain?.id,
        sender: provider.selectedAddress,
      },
    })
    await provider.signAndSendTx(data.tx_body)
    onNext()
  } catch (e) {
    toStep(STEPS.match)
    throw e
  }
}

const claim = async () => {
  toStep(STEPS.confirmationClaim)
  try {
    const matchId = await getMatchId()
    const { data: test } = await callers.post<TxResposne>('/v1/execute/order', {
      data: {
        dest_chain: props.order.destination_chain?.id,
        order_id: props.order.order_id,
        src_chain: props.order.src_chain?.id,
        receiver: provider.selectedAddress,
        sender: provider.selectedAddress,
        match_id: matchId,
      },
    })
    await provider.signAndSendTx(test.tx_body)
    Bus.emit(Bus.eventList.orderMatched)
    Bus.success(t('match-order-form.matched-msg'))
    emit('close')
  } catch (e) {
    toStep(STEPS.claim)
    ErrorHandler.process(e)
  }
}

const getMatchId = async () => {
  const rpcProvider = new ethers.providers.JsonRpcProvider(
    props.order.destination_chain?.chain_params.rpc,
  )
  swapicaContract.init(
    props.order.destination_chain?.swap_contract!,
    rpcProvider,
  )
  const matchLength = await swapicaContract.getUserMatchesLength(
    provider.selectedAddress!,
  )
  const data = await swapicaContract.getUserMatches(
    provider.selectedAddress!,
    matchLength!.toNumber() - 1,
    1,
  )
  return data[0].matchId.toNumber()
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
