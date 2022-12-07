<template>
  <div
    class="app-navbar"
    :class="{ 'app-navbar--opened': isMobileNavigationShown }"
  >
    <div>
      <app-logo class="app-navbar__logo" />
    </div>
    <div>
      <app-button
        v-if="isMobile"
        class="app-navbar__toogle-btn"
        :icon-right="isMobileNavigationShown ? $icons.close : $icons.menu"
        @click="isMobileNavigationShown = !isMobileNavigationShown"
      />
    </div>

    <transition name="app-navigation-mobile-transition">
      <div class="nav-mob" v-if="isMobileNavigationShown">
        <!-- {{ 'wfewfew' }} -->
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { AppLogo, AppButton } from '@/common'
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { width: windowWidth } = useWindowSize()
const isMobileNavigationShown = ref(false)

const isMobile = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: toRem(29.5) var(--app-padding-right) toRem(29.5)
    var(--app-padding-left);
  position: relative;
  transition: background-color 0.3s;

  &--opened {
    background: #fcf9f2;
  }

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  @include respond-to(xsmall) {
    width: 100%;
  }
}

.app-navbar__toogle-btn {
  --button-icon-size: #{toRem(40)};
}

.nav-mob {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fcf9f2;
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
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
