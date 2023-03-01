<template>
  <div class="match-order-form-match-step">
    <h4 class="match-order-form-match-step__title">
      {{ $t('match-order-form-match-step.title') }}
    </h4>

    <i18n-t
      keypath="match-order-form-match-step.description"
      tag="p"
      class="match-order-form-match-step__desc"
    >
      <template #tokenSell>
        <span class="match-order-form-match-step__desc-token-bold">
          {{
            $t('match-order-form-match-step.recieve-token-msg', {
              token: order.token_to_sell.symbol,
              amount: formatWeiAmount(
                order.amount_to_sell,
                order.token_to_sell.decimals,
              ),
            })
          }}
        </span>
      </template>
      <template #tokenBuy>
        {{ formatWeiAmount(order.amount_to_buy, order.token_to_buy.decimals) }}
        {{ order.token_to_buy.symbol }}
      </template>
    </i18n-t>

    <div class="match-order-form-match-step__actions">
      <app-button
        class="match-order-form-match-step__action"
        scheme="secondary"
        :text="$t('match-order-form-match-step.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="match-order-form-match-step__action"
        scheme="primary"
        :text="$t('match-order-form-match-step.confirm-btn')"
        @click="emit('confirm')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'
import { Order } from '@/types'
import { formatWeiAmount } from '@/helpers'

defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>

<style lang="scss" scoped>
.match-order-form-match-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.match-order-form-match-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0 toRem(16);
  }
}

.match-order-form-match-step__actions {
  margin-top: toRem(21);
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: toRem(366);
  gap: toRem(32);

  @include respond-to(tablet) {
    gap: toRem(16);
    margin-top: toRem(24);
  }
}

.match-order-form-match-step__action {
  width: 100%;
}

.match-order-form-match-step__desc {
  text-align: center;
}

.match-order-form-match-step__desc-token-bold {
  color: var(--text-primary-dark);
}
</style>
