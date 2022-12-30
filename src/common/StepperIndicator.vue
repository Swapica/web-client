<template>
  <div class="stepper-indicator">
    <i
      v-for="(i, index) in steps"
      :key="index"
      v-show="!i.isHidden"
      class="stepper-indicator__dot"
      :class="{
        'stepper-indicator__dot--active': index <= currentStepIdx,
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { Step } from '@/types'

defineProps<{
  steps: Step[]
  currentStepIdx: number
}>()
</script>

<style lang="scss" scoped>
.stepper-indicator {
  display: flex;
  gap: toRem(12);
  justify-content: center;
}

.stepper-indicator__dot {
  width: toRem(16);
  height: toRem(13);
  background: url('/backgrounds/step-bg.svg') no-repeat;
  background-size: 100% 100%;

  &--active {
    background: url('/backgrounds/step-active-bg.svg') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
