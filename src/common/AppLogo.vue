<template>
  <div class="app-logo">
    <img class="app-logo__img" :src="logo" :alt="$config.APP_NAME" />
    <a class="app-logo__link" :href="$config.LANDING_URL" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import Logo from '/branding/logo.svg'
import LogoMobile from '/branding/logo-mobile.svg'

const { width: windowWidth } = useWindowSize()
const logo = computed(() => {
  return isMobile.value ? LogoMobile : Logo
})

const isMobile = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
</script>
<style lang="scss" scoped>
.app-logo {
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-logo__link {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
