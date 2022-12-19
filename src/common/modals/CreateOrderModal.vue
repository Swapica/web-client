<template>
  <modal
    class="create-order-modal"
    :is-shown="isShown"
    @update:is-shown="close"
  >
    <create-order-form
      :key="`${isShown}`"
      class="create-order-modal__form"
      @close="close"
    />
  </modal>
</template>

<script lang="ts" setup>
import CreateOrderForm from '@/forms/CreateOrderForm.vue'
import { Modal } from '@/common'

defineProps<{
  isShown: boolean
}>()

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()

const close = () => emit('update:is-shown', false)
</script>

<style lang="scss" scoped>
.create-order-modal {
  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.modal__pane) {
    max-width: toRem(658);
    width: 100%;
    padding: toRem(24) toRem(16) toRem(48) toRem(17);

    @include respond-to(small) {
      padding: toRem(16) toRem(9) toRem(31) toRem(23);
    }
  }
}

.create-order-modal__form {
  align-items: center;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;

  @include scrollbar;
}
</style>
