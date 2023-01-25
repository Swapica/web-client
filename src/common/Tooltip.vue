<template>
  <div
    class="tooltip"
    @mouseover="isShown = true"
    @mouseleave="isShown = false"
  >
    <slot />
    <div v-if="isShown && isShowTooltip" class="tooltip__content">
      <span v-if="title" class="tooltip__title">{{ title }}</span>
      <p v-if="message" class="tooltip__message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(
  defineProps<{
    title?: string
    message: string
    isShowTooltip: boolean
  }>(),
  {
    title: '',
    isShowTooltip: true,
  },
)
const isShown = ref(false)
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
}

.tooltip__content {
  position: absolute;
  padding: toRem(23) toRem(19) toRem(37) toRem(25);
  background: url('/backgrounds/tooltip-bg.svg') no-repeat;
  background-size: 100% 100%;
  min-width: toRem(221);
  bottom: 50%;
  left: 65%;
  z-index: var(--z-index-default);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tooltip__title {
  font-size: toRem(18);
  line-height: 1;
  margin-bottom: toRem(8);
  color: var(--text-primary-dark);
  text-align: center;
}

.tooltip__message {
  font-size: toRem(14);
  line-height: 1;
  text-align: center;
}
</style>
