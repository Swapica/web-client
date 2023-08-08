<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div
    class="automatic-claim-block"
    :class="{
      'automatic-claim-block--disabled': isDisabled,
    }"
  >
    <checkbox-field
      :model-value="modelValue"
      :disabled="isDisabled"
      :label="$t('automatic-claim-block.label')"
      :description="
        description || $t('automatic-claim-block.description', {
          token: symbol || tokenInfo?.symbol,
        })
      "
      @update:model-value="emit('update:modelValue', $event)"
    />
    <div
      class="automatic-claim-block__claim-price"
      :class="{ 'automatic-claim-block__claim-price--failed': isLoadingFailed }"
    >
      <template v-if="isLoading">
        <loader class="automatic-claim-block__claim-price-loader" />
      </template>
      <template v-else-if="isLoadingFailed">
        <p class="automatic-claim-block__claim-price-failed">
          {{ $t('automatic-claim-block.failed-commision-msg') }}
        </p>
      </template>
      <template v-else-if="price?.upper_commission">
        <p class="automatic-claim-block__claim-price-native">
          {{
            `${formatAmount(
              price?.upper_commission || 0,
              decimals || tokenInfo?.decimals,
            )} ${symbol || tokenInfo?.symbol}`
          }}
        </p>
        <p class="automatic-claim-block__claim-price-usd">
          {{ `~ ${formatAmount(price?.upper_commission_usd || 0, 2)} USD` }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxField } from '@/fields'
import { ErrorHandler, formatAmount, getTokenInfo } from '@/helpers'
import { Loader } from '@/common'
import { api } from '@/api'
import { useChainsStore } from '@/store'
import { computed, ref, watch } from 'vue'
import { BN } from '@/utils'
import { debounce } from 'lodash-es'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    isDisabled?: boolean
    tokenBuy: string
    networkBuy: string
    amount: string
    decimals?: number
    symbol?: string
    description?: string
  }>(),
  {
    isDisabled: false,
    decimals: undefined,
    symbol: '',
    description: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { chainById } = useChainsStore()
const networkBuy = computed(() => chainById(props.networkBuy))
const tokenInfo = ref()
const price = ref()
const isLoading = ref(false)
const isLoadingFailed = ref(false)

const getPrice = async () => {
  if (!props.tokenBuy || !+props.amount) {
    price.value = null
    return
  }
  isLoadingFailed.value = false
  isLoading.value = true
  try {
    let amount = props.amount
    if (!props.decimals || !props.symbol) {
      tokenInfo.value = await getTokenInfo(networkBuy.value!, props.tokenBuy)
      amount = new BN(props.amount)
        .toFraction(tokenInfo.value.decimals)
        .toString()
    }
    const { data } = await api.get('/v1/commission_estimate', {
      params: {
        token_to_buy: props.tokenBuy,
        amount_to_buy: amount,
        dest_chain: props.networkBuy,
      },
    })
    price.value = data
  } catch (e) {
    isLoadingFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoading.value = false
}

watch(
  [() => props.amount, () => props.tokenBuy],
  debounce(() => {
    getPrice()
  }, 500),
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.automatic-claim-block {
  max-width: toRem(482);
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: toRem(10);

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.tooltip__content) {
    left: 60%;
    transform: translateX(-60%);
  }
}

.automatic-claim-block__claim-price {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: toRem(2);

  &--failed {
    justify-content: center;
  }

  .automatic-claim-block--disabled & {
    opacity: 0.5;
  }
}

.automatic-claim-block__claim-price-native {
  font-size: toRem(16);
  line-height: 1.2;
  text-align: right;
  color: var(--text-primary-dark);
}

.automatic-claim-block__claim-price-usd {
  font-size: toRem(12);
  line-height: 1.2;
  text-align: right;
  color: var(--text-primary-main);
}

.automatic-claim-block__claim-price-loader {
  align-items: flex-end;
  height: toRem(40);
}

.automatic-claim-block__claim-price-failed {
  font-size: toRem(14);
  color: var(--error-dark);
  text-align: right;
}
</style>
