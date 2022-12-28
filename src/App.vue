<template>
  <div v-if="isAppInitialized" class="app__container">
    <template v-if="isAppLoadFailed">
      <error-message class="app__error-msg" :message="$t('app.error-msg')" />
    </template>
    <template v-else>
      <app-navbar class="app__navbar" />
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component class="app__main" :is="Component" />
        </transition>
      </router-view>
    </template>
  </div>
  <template v-else>
    <loader class="app__loader" />
  </template>
</template>

<script lang="ts" setup>
import { AppNavbar, Loader, ErrorMessage } from '@/common'

import { ErrorHandler } from '@/helpers/error-handler'
import { ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore, useChainsStore, useTokensStore } from '@/store'
import { PROVIDERS } from './enums'

const web3Store = useWeb3ProvidersStore()
const chainStore = useChainsStore()
const tokenStore = useTokensStore()
const isAppInitialized = ref(false)
const isAppLoadFailed = ref(false)
const init = async () => {
  try {
    useNotifications()
    await chainStore.loadChains()
    await tokenStore.loadTokens()

    await web3Store.detectProviders()

    const provider = web3Store.providers.find(
      provider => provider.name === PROVIDERS.metamask,
    )

    if (provider) {
      await web3Store.provider.init(provider)
    }
    document.title = config.APP_NAME
  } catch (error) {
    isAppLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(error)
  }
  isAppInitialized.value = true
}

init()
</script>

<style lang="scss" scoped>
.app__container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.app__main {
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  max-width: calc(#{toRem(887)} + var(--app-padding-right) * 2);
  margin: 0 auto;
  width: 100%;
}

.app__loader,
.app__error-msg {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
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
