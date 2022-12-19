<template>
  <div class="stepper-indicator">
    <i
      v-for="idx in totalSteps"
      :key="idx"
      class="stepper-indicator__dot"
      :class="{
        'stepper-indicator__dot--active': idx - 1 <= currentStepIdx,
      }"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  totalSteps: number
  currentStepIdx: number
}>()
</script>

<style lang="scss" scoped>
.stepper-indicator {
  display: grid;
  grid: auto / auto-flow auto;
  gap: toRem(12);
  justify-content: start;
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
