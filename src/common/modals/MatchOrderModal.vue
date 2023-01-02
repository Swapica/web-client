<template>
  <modal class="match-order-modal" :is-shown="isShown" @update:is-shown="close">
    <match-order-form
      class="match-order-modal__form"
      :key="`${isShown}`"
      :order="order"
      :network-sell="networkSell"
      @close="close"
    />
  </modal>
</template>

<script lang="ts" setup>
import MatchOrderForm from '@/forms/MatchOrderForm.vue'
import { Modal } from '@/common'
import { ChainResposne, UserOrder } from '@/types'

defineProps<{
  isShown: boolean
  order: UserOrder
  networkSell: ChainResposne
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()

const close = () => emit('update:is-shown', false)
</script>

<style lang="scss" scoped>
.match-order-modal {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.modal__pane) {
    max-width: toRem(658);
    width: 100%;
    padding: toRem(24) toRem(16) toRem(48) toRem(17);

    @include respond-to(small) {
      padding: toRem(16) toRem(10) toRem(31) toRem(23);
    }
  }
}

.match-order-modal__form {
  align-items: center;
  display: flex;
  flex-direction: column;

  @include respond-to-height(500px) {
    overflow: hidden auto;

    @include scrollbar;
  }
}
</style>
