<template>
  <div class="stepper-indicator">
    <i
      v-for="idx in totalSteps"
      :key="idx"
      class="stepper-indicator__dot"
      :class="{
        'stepper-indicator__dot--active': idx - 1 <= currentStepIdx,
        'stepper-indicator__dot--wide': idx - 1 === currentStepIdx,
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
  gap: 1.2rem;
  justify-content: start;
}

.stepper-indicator__dot {
  width: 0.4rem;
  height: 0.4rem;
  background-color: transparent;
  border-radius: 0.2rem;

  &--wide {
    width: 1.8rem;
  }

  &--active {
    // background-color: $col-success;
  }
}
</style>
