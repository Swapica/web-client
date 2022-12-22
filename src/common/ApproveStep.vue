<template>
  <div class="approve-step">
    <h4 class="approve-step__title">
      {{ $t('approve-step.title') }}
    </h4>

    <template v-if="$slots.default">
      <slot />
    </template>

    <div class="approve-step__actions">
      <app-button
        class="approve-step__action"
        :text="$t('approve-step.back-btn')"
        scheme="secondary"
        @click="emit('back')"
      />
      <app-button
        class="approve-step__action"
        :text="$t('approve-step.approve-btn')"
        scheme="primary"
        @click="emit('approve')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'approve'): void
}>()
</script>

<style lang="scss" scoped>
.approve-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(564);
  width: 100%;
}

.approve-step__title {
  margin: toRem(16) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0 toRem(16);
  }
}

.approve-step__actions {
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

.approve-step__action {
  width: 100%;
}
</style>
