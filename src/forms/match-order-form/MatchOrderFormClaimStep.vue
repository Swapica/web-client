<template>
  <div class="match-order-form-claim-step">
    <h4 class="match-order-form-claim-step__title">
      {{ $t('match-order-form-claim-step.title') }}
    </h4>

    <i18n-t
      keypath="match-order-form-claim-step.description"
      tag="p"
      class="match-order-form-claim-step__desc"
    >
      <template #tokenSell>
        <span class="match-order-form-claim-step__desc-token-bold">
          {{
            formatWeiAmount(order.amount_to_sell, order.token_to_sell.decimals)
          }}
          {{ order.token_to_sell.symbol }}
        </span>
      </template>
    </i18n-t>

    <div class="match-order-form-claim-step__actions">
      <app-button
        class="match-order-form-claim-step__action"
        scheme="secondary"
        :text="$t('match-order-form-claim-step.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="match-order-form-claim-step__action"
        scheme="primary"
        :text="$t('match-order-form-claim-step.claim-btn')"
        @click="emit('claim')"
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
  (e: 'claim'): void
}>()
</script>

<style lang="scss" scoped>
.match-order-form-claim-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.match-order-form-claim-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0 toRem(16);
  }
}

.match-order-form-claim-step__actions {
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

.match-order-form-claim-step__action {
  width: 100%;
}

.match-order-form-claim-step__desc {
  text-align: center;
}

.match-order-form-claim-step__desc-token-bold {
  color: var(--text-primary-dark);
}
</style>
