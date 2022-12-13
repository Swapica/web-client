<script lang="ts" setup>
import { AppNavbar } from '@/common'

import { ErrorHandler } from '@/helpers/error-handler'
import { ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore } from '@/store'

const web3Store = useWeb3ProvidersStore()
const isAppInitialized = ref(false)
const init = async () => {
  try {
    useNotifications()
    await web3Store.detectProviders()

    document.title = config.APP_NAME
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

init()
</script>

<template>
  <div v-if="isAppInitialized" class="app__container">
    <app-navbar class="app__navbar" />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.app__container {
  overflow: hidden;
  display: grid;
  grid-template-rows: toRem(96) 1fr max-content;
  flex: 1;

  @include respond-to(small) {
    grid-template-rows: max-content 1fr max-content;
  }
}

.app__main {
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  max-width: calc(#{toRem(887)} + var(--app-padding-right) * 2);
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
