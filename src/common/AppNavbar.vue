<template>
  <div class="app-navbar" :class="{ 'app-navbar--mobile': isMobile }">
    <div class="app-navbar__content">
      <app-logo class="app-navbar__logo" />

      <div v-if="!isMobile" class="app-navbar__nav">
        <router-link class="app-navbar__link" :to="{ name: $routes.dashboard }">
          {{ $t('app-navbar.dashboard-link') }}
        </router-link>
        <router-link class="app-navbar__link" :to="{ name: $routes.myOrders }">
          {{ $t('app-navbar.my-orders-link') }}
        </router-link>
        <router-link class="app-navbar__link" :to="{ name: $routes.claim }">
          {{ $t('app-navbar.claim-link') }}
        </router-link>
      </div>
    </div>
    <div class="app-navbar__actions">
      <chain-selector />
      <connect-wallet-btn v-if="!isMobile" />
      <app-button
        v-if="isMobile"
        class="app-navbar__toogle-btn"
        :icon-right="$icons.menu"
        @click="isMobileNavigationShown = true"
      />
    </div>
    <app-navigation-mobile
      :is-shown="isMobileNavigationShown"
      @close-nav="isMobileNavigationShown = false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  AppLogo,
  AppButton,
  AppNavigationMobile,
  ConnectWalletBtn,
  ChainSelector,
} from '@/common'
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
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  position: fixed;
  top: 0;
  background-color: var(--background-primary-main);
  box-shadow: 0 toRem(2) toRem(12) var(--shadow-primary-dark);
  height: toRem(96);
  z-index: var(--z-index-navigation);
  width: 100vw;

  @include respond-to(tablet) {
    flex-wrap: wrap;
    height: toRem(88);
    padding: toRem(24) var(--app-padding-right) toRem(24)
      var(--app-padding-left);
  }
}

.app-navbar__content {
  display: flex;
  gap: toRem(32);
  align-items: center;
}

.app-navbar__nav {
  display: flex;
  gap: toRem(32);
}

.app-navbar__link {
  padding: toRem(11.5) toRem(12);
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
    height: toRem(6.5);
    right: 0;
    bottom: 0;
    transition: width 0.2s ease-in-out;
  }

  &.router-link-active {
    opacity: 1;

    &:after {
      left: 0;
      width: 100%;
    }
  }
}

.app-navbar__logo {
  width: toRem(40);
  height: toRem(40);

  .app-navbar--mobile & {
    width: toRem(120);
    height: toRem(23);
  }
}

.app-navbar__toogle-btn {
  --button-icon-size: #{toRem(40)};
}

.app-navbar__actions {
  display: flex;
  align-items: center;
  gap: toRem(32);

  @include respond-to(tablet) {
    gap: toRem(8);
  }
}
</style>
