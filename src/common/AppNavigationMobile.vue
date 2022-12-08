<template>
  <transition name="app-navigation-mobile-transition">
    <div v-if="isShown" class="app-navigation-mobile">
      <div ref="navRef" class="app-navigation-mobile__content"></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { nextTick, watch, ref } from 'vue'

const props = defineProps<{
  isShown: boolean
}>()

const navRef = ref<HTMLElement>()

watch(
  () => props.isShown,
  isShown => {
    if (isShown) {
      nextTick(() => disableBodyScroll(navRef.value!))
    } else {
      enableBodyScroll(navRef.value!)
    }
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 10;

.app-navigation-mobile {
  position: fixed;
  top: toRem(80);
  left: 0;
  width: 100vw;
  height: calc(100vh - #{toRem(80)});
  background: rgba(var(--black-rgb), 0.1);
  z-index: $z-local-index;
}

.app-navigation-mobile__content {
  padding: toRem(24) toRem(24) toRem(40);
  background: var(--background-primary-light);
}

.app-navigation-mobile-transition-enter-active {
  animation: app-navigation-mobile-keyframes 0.3s ease-in-out;
}

.app-navigation-mobile-transition-leave-active {
  animation: app-navigation-mobile-keyframes 0.3s ease-in-out reverse;
}

@keyframes app-navigation-mobile-keyframes {
  from {
    opacity: 0;
    height: 0;
  }

  to {
    opacity: 1;
    height: calc(100vh - #{toRem(80)});
  }
}
</style>
