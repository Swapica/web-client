<template>
  <div
    class="created-orders"
    :class="{
      'created-orders--without-btn': isListEmpty || !provider.selectedAddress,
    }"
  >
    <div class="created-orders__title-wrp">
      <h5 class="created-orders__title">
        {{ $t('created-orders.title') }}
      </h5>
      <select-field
        class="created-orders__network-select"
        v-model="networkId"
        scheme="primary"
        size="medium"
        :disabled="isLoading"
        :value-options="chains"
      />
    </div>
    <div
      v-if="provider.isConnected && !isListEmpty"
      class="created-orders__create-btn-wrp"
      :class="{
        'created-orders__create-btn-wrp--fixed': isButtonFixed,
      }"
    >
      <app-button
        class="created-orders__create-btn"
        size="small"
        :scheme="isTablet ? 'primary-mobile' : 'primary'"
        :text="$t('created-orders.create-btn')"
        :disabled="isLoadFailed || isLoading"
        @click="isCreateOrderModalShown = true"
      />
    </div>
    <div class="created-orders__content">
      <template v-if="provider.isConnected">
        <order-list
          :chain-id="networkId"
          @list-empty="isListEmpty = $event"
          @load-failed="isLoadFailed = $event"
          @is-loading="isLoading = $event"
        >
          <template #noDataMsg>
            <no-data-message
              class="created-orders__no-data-block"
              :message="$t('created-orders.no-data-msg')"
            >
              <app-button
                class="created-orders__no-data-create-btn"
                scheme="primary"
                :text="$t('created-orders.create-btn')"
                @click="isCreateOrderModalShown = true"
              />
            </no-data-message>
          </template>
        </order-list>
      </template>
      <template v-else>
        <no-data-message
          class="created-orders__connect-block"
          :message="$t('created-orders.connect-wallet-msg')"
        >
          <connect-wallet-btn />
        </no-data-message>
      </template>
    </div>

    <create-order-modal v-model:is-shown="isCreateOrderModalShown" />
  </div>
</template>

<script lang="ts" setup>
import {
  AppButton,
  ConnectWalletBtn,
  NoDataMessage,
  OrderList,
  CreateOrderModal,
} from '@/common'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { computed, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { SelectField } from '@/fields'

const emit = defineEmits<{
  (e: 'is-button-fixed', value: boolean): void
}>()

const { width: windowWidth } = useWindowSize()
const { provider } = useWeb3ProvidersStore()
const chainStore = useChainsStore()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const isButtonFixed = computed(
  () => !isListEmpty.value && !isLoading.value && !isLoadFailed.value,
)

const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.chain_params.chain_id,
  })),
)

const isListEmpty = ref(true)
const isLoadFailed = ref(false)
const isLoading = ref(false)
const isCreateOrderModalShown = ref(false)
const networkId = ref(
  chainStore.selectedChain?.chain_params.chain_id ??
    chainStore.chains[0].chain_params.chain_id,
)

watch(isButtonFixed, val => {
  emit('is-button-fixed', val)
})
</script>

<style lang="scss" scoped>
.created-orders {
  display: grid;
  grid-template-columns: 1fr toRem(181);
  gap: toRem(12);
  align-items: center;
  grid-template-areas:
    'title button'
    'content content';

  &--without-btn {
    grid-template-areas:
      'title title'
      'content content';
  }

  @include respond-to(tablet) {
    gap: toRem(8);
    grid-template-columns: 1fr;
    grid-template-areas:
      'title'
      'content'
      'button';
  }
}

.created-orders__create-btn {
  width: 100%;

  @include respond-to(tablet) {
    width: toRem(288);
    margin: 0 auto;
  }
}

.created-orders__create-btn-wrp {
  grid-area: button;

  &--fixed {
    @include respond-to(tablet) {
      z-index: var(--z-index-default);
      border: toRem(1) solid var(--border-primary-main);
      border-radius: toRem(24) toRem(24) 0 0;
      box-shadow: 0 toRem(-2) toRem(8) rgba(var(--black-rgb), 0.15);
      padding: toRem(15);
      background: var(--background-primary-main);
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
}

.created-orders__title-wrp {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.created-orders__title {
  margin-left: toRem(32);

  @include respond-to(tablet) {
    margin-left: toRem(12);
  }
}

.created-orders__content {
  grid-area: content;
  background: url('/backgrounds/block-bg.svg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  min-height: toRem(380);
  display: flex;
  padding: toRem(32) toRem(42) toRem(46) toRem(50);

  @include respond-to(tablet) {
    padding: toRem(17) toRem(10) toRem(26) toRem(21);
    min-height: toRem(210);
  }
}

.created-orders__connect-block {
  @include respond-to(xsmall) {
    max-width: toRem(232);
    margin: 0 auto;
  }
}

.created-orders__no-data-create-btn {
  width: toRem(181);
}

.created-orders__no-data-block {
  max-width: toRem(417);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.created-orders__network-select {
  max-width: toRem(158);
  width: 100%;
}
</style>
