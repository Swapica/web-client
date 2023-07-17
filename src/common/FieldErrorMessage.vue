<template>
  <transition
    name="field-error-message"
    @enter="setHeightCSSVar"
    @before-leave="setHeightCSSVar"
  >
    <p v-if="errorMessage" class="field-error-message__err-msg">
      {{ errorMessage }}
    </p>
  </transition>
</template>
<script lang="ts" setup>
defineProps<{
  errorMessage: string
}>()

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-message-height',
    `${element.scrollHeight}px`,
  )
}
</script>
<style lang="scss" scoped>
.field-error-message__err-msg {
  @include field-error;
}

.field-error-message-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.field-error-message-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-message-height);
  }
}
</style>
