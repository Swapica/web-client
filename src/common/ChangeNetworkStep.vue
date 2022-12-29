<template>
  <div class="change-network-step">
    <h4 class="change-network-step__title">
      {{ $t('change-network-step.title') }}
    </h4>

    <template v-if="$slots.default">
      <slot />
    </template>

    <div class="change-network-step__actions">
      <app-button
        class="change-network-step__action"
        scheme="secondary"
        :text="$t('change-network-step.cancel-btn')"
        :disabled="isSubmitting"
        @click="emit('cancel')"
      />
      <app-button
        class="change-network-step__action"
        scheme="primary"
        :text="$t('change-network-step.change-network-btn')"
        :disabled="isSubmitting"
        @click="switchChain"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'
import { ErrorHandler, switchNetwork } from '@/helpers'
import { ChainResposne } from '@/types'
import { ref } from 'vue'

const props = defineProps<{
  network: ChainResposne
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'changed'): void
}>()

const isSubmitting = ref(false)

const switchChain = async () => {
  isSubmitting.value = true
  try {
    await switchNetwork(props.network)
    emit('changed')
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}
</script>

<style lang="scss" scoped>
.change-network-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.change-network-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0 toRem(16);
  }
}

.change-network-step__actions {
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

.change-network-step__action {
  width: 100%;
}
</style>
