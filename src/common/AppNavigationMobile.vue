<template>
  <transition name="app-navigation-mobile-transition">
    <div v-if="isShown" class="app-navigation-mobile">
      <div class="app-navigation-mobile__content-wrp">
        <div ref="navRef" class="app-navigation-mobile__content">
          <div class="app-navigation-mobile__nav">
            <router-link
              class="app-navigation-mobile__link"
              :to="{ name: $routes.uiKit }"
              @click="closeNav"
            >
              {{ $t('app-navigation-mobile.dashboard-link') }}
            </router-link>
          </div>
          <div class="app-navigation-mobile__actions">
            <app-button scheme="primary" :text="'Connect'" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { nextTick, watch, ref } from 'vue'
import { AppButton } from '@/common'

const emit = defineEmits<{
  (e: 'close-nav'): void
}>()

const props = defineProps<{
  isShown: boolean
}>()

const navRef = ref<HTMLElement>()

const closeNav = () => emit('close-nav')

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
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: auto;
  height: 100%;

  @include scrollbar;
}

.app-navigation-mobile__content-wrp {
  padding: toRem(24) toRem(24) toRem(40);
  background: url('/backgrounds/navbar-bg.svg') no-repeat,
    linear-gradient(
      var(--background-primary-light) 90%,
      rgba(var(--white-rgb), 0) 10%
    );
  background-size: 100% 100%;
  max-height: toRem(440);
  height: 100%;
}

.app-navigation-mobile__nav {
  margin-bottom: toRem(130);
  display: flex;
  flex-direction: column;
  gap: toRem(24);
  flex: 1;
}

.app-navigation-mobile__link {
  padding: toRem(14.5) toRem(24);
  position: relative;
  color: var(--text-primary-dark);
  opacity: 0.5;
  transition: color 0.3s;

  &:hover {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    background: url('/backgrounds/button-underline.svg') no-repeat;
    background-size: 100% 100%;
    width: 0;
    height: toRem(7.8);
    left: 0;
    bottom: 0;
    transition: width 0.2s ease-in-out;
  }

  &.router-link-active {
    opacity: 1;

    &:after {
      width: 100%;
    }
  }
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
