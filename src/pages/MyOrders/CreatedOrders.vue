<template>
  <div class="created-orders">
    <h5 class="created-orders__title">
      {{ $t('created-orders.title') }}
    </h5>
    <app-button
      v-if="provider.isConnected"
      class="created-orders__create-btn"
      scheme="primary"
      :text="$t('created-orders.create-btn')"
    />
    <div class="created-orders__content">
      <template v-if="provider.isConnected">
        <order-list>
          <template #noDataMsg>
            <no-data-message
              class="created-orders__no-data-block"
              :message="$t('created-orders.no-data-msg')"
            >
              <app-button
                class="created-orders__no-data-create-btn"
                scheme="primary"
                :text="$t('created-orders.create-btn')"
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
  </div>
</template>

<script lang="ts" setup>
import { AppButton, ConnectWalletBtn, NoDataMessage, OrderList } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

const { provider } = storeToRefs(useWeb3ProvidersStore())
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
