<template>
  <div class="created-orders">
    <h5 class="created-orders__title">
      {{ $t('created-orders.title') }}
    </h5>
    <app-button
      v-if="provider.isConnected && isCreateOrderBtnShown"
      class="created-orders__create-btn"
      :scheme="isTablet ? 'primary-mobile' : 'primary'"
      :text="$t('created-orders.create-btn')"
      :disabled="isCreateOrderBtnDisabled"
      @click="isCreateOrderModalShown = true"
    />
    <div class="created-orders__content">
      <template v-if="provider.isConnected">
        <order-list
          @list-empty="isCreateOrderBtnShown = false"
          @load-failed="isCreateOrderBtnDisabled = true"
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
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { width: windowWidth } = useWindowSize()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const { provider } = storeToRefs(useWeb3ProvidersStore())

const isCreateOrderBtnShown = ref(true)
const isCreateOrderBtnDisabled = ref(false)
const isCreateOrderModalShown = ref(false)
</script>

<style lang="scss" scoped>
.created-orders {
  display: grid;
  grid-template-columns: 1fr toRem(181);
  align-items: center;
  grid-template-areas:
    'title button'
    'content content';

  @include respond-to(tablet) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'title'
      'content'
      'button';
  }
}

.created-orders__create-btn {
  width: 100%;
  grid-area: button;

  @include respond-to(tablet) {
    width: toRem(288);
    margin: toRem(9) auto 0;
  }
}

.created-orders__title {
  margin-left: toRem(32);
  grid-area: title;

  @include respond-to(tablet) {
    margin-left: toRem(12);
  }
}

.created-orders__content {
  grid-area: content;
  margin-top: toRem(12);
  background: url('/backgrounds/block-bg.svg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  min-height: toRem(380);
  display: flex;
  padding: toRem(32) toRem(42) toRem(46) toRem(50);

  @include respond-to(tablet) {
    margin-top: toRem(15.5);
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
</style>
