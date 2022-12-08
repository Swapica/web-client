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
    <app-navigation-mobile
      :is-shown="isMobileNavigationShown"
      @close-nav="isMobileNavigationShown = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppLogo, AppButton, AppNavigationMobile } from '@/common'
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
  width: 100vw;

  &--opened {
    background: var(--background-primary-light);
  }

  @include respond-to(tablet) {
    flex-wrap: wrap;
    height: toRem(80);
    padding: toRem(20) var(--app-padding-right) toRem(20)
      var(--app-padding-left);
  }
}

.app-navbar__logo {
  width: toRem(95);
  height: toRem(37);
}

.app-navbar__toogle-btn {
  --button-icon-size: #{toRem(40)};
}
</style>
