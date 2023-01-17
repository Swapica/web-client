<template>
  <div class="expired-orders">
    <div class="expired-orders__title-wrp">
      <h5 class="expired-orders__title">
        {{ $t('expired-orders.title') }}
      </h5>
      <select-field
        class="expired-orders__network-select"
        v-model="networkId"
        scheme="primary"
        size="medium"
        :disabled="isLoading"
        :value-options="chains"
      />
    </div>
    <div class="expired-orders__content">
      <template v-if="provider.isConnected">
        <expired-orders-list
          :chain-id="networkId"
          @is-loading="isLoading = $event"
        >
          <template #noDataMsg>
            <no-data-message
              class="expired-orders__no-data-block"
              :message="$t('expired-orders.no-data-msg')"
            >
              <app-button
                class="expired-orders__no-data-dashboard-link"
                scheme="primary"
                :text="$t('expired-orders.dashboard-link')"
                :route="{ name: $routes.dashboard }"
              />
            </no-data-message>
          </template>
        </expired-orders-list>
      </template>
      <template v-else>
        <no-data-message
          class="expired-orders__connect-block"
          :message="$t('expired-orders.connect-wallet-msg')"
        >
          <connect-wallet-btn />
        </no-data-message>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, ConnectWalletBtn, NoDataMessage } from '@/common'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { SelectField } from '@/fields'
import ExpiredOrdersList from '@/pages/MyOrders/ExpiredOrdersList.vue'

const { provider } = storeToRefs(useWeb3ProvidersStore())
const chainStore = useChainsStore()
const networkId = ref(
  chainStore.selectedChain?.chain_params.chain_id ??
    chainStore.chains[0].chain_params.chain_id,
)

const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.chain_params.chain_id,
  })),
)

const isLoading = ref(false)
</script>

<style lang="scss" scoped>
.expired-orders {
  display: grid;
  grid-template-columns: 1fr;
  gap: toRem(12);
  align-items: center;
  grid-template-areas:
    'title'
    'content';

  @include respond-to(tablet) {
    gap: toRem(8);
    grid-template-columns: 1fr;
    grid-template-areas:
      'title'
      'content';
  }
}

.expired-orders__title-wrp {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.expired-orders__title {
  margin-left: toRem(32);

  @include respond-to(tablet) {
    margin-left: toRem(12);
  }
}

.expired-orders__content {
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

.expired-orders__connect-block {
  @include respond-to(xsmall) {
    max-width: toRem(232);
    margin: 0 auto;
  }
}

.expired-orders__no-data-dashboard-link {
  width: toRem(181);
}

.expired-orders__no-data-block {
  max-width: toRem(552);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.expired-orders__network-select {
  max-width: toRem(158);
  width: 100%;
}
</style>
