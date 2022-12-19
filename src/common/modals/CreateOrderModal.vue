<template>
  <modal
    class="create-order-modal"
    :is-shown="isShown"
    @update:is-shown="close"
  >
    <create-order-form />
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
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}
</style>
