<template>
  <div class="claim-orders">
    <div class="claim-orders__title-wrp">
      <h5 class="claim-orders__title">
        {{ $t('claim-orders.title') }}
      </h5>
      <select-field
        class="claim-orders__network-select"
        v-model="networkId"
        scheme="primary"
        size="medium"
        is-need-all-option
        :disabled="isLoading"
        :value-options="chains"
      />
    </div>
    <div class="claim-orders__content">
      <template v-if="provider.isConnected">
        <claim-order-list
          :chain-id="networkId"
          @is-loading="isLoading = $event"
        >
          <template #noDataMsg>
            <no-data-message
              class="claim-orders__no-data-block"
              :message="$t('claim-orders.no-data-msg')"
            >
              <app-button
                class="claim-orders__no-data-dashboard-link"
                scheme="primary"
                :route="{ name: $routes.dashboard }"
                :text="$t('claim-orders.dashboard-link')"
              />
            </no-data-message>
          </template>
        </claim-order-list>
      </template>
      <template v-else>
        <no-data-message
          class="claim-orders__connect-block"
          :message="$t('claim-orders.connect-wallet-msg')"
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
import { computed, ref } from 'vue'
import { SelectField } from '@/fields'
import ClaimOrderList from '@/pages/Claim/ClaimOrderList.vue'

const { provider } = useWeb3ProvidersStore()
const chainStore = useChainsStore()
const networkId = ref<string | number>('')

const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.chain_params.chain_id,
  })),
)

const isLoading = ref(false)
</script>

<style lang="scss" scoped>
.claim-orders {
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

.claim-orders__title-wrp {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.claim-orders__title {
  margin-left: toRem(32);

  @include respond-to(tablet) {
    margin-left: toRem(12);
  }
}

.claim-orders__content {
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

.claim-orders__connect-block {
  @include respond-to(xsmall) {
    max-width: toRem(232);
    margin: 0 auto;
  }
}

.claim-orders__no-data-dashboard-link {
  width: toRem(181);
}

.claim-orders__no-data-block {
  max-width: toRem(543);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(269);
  }
}

.claim-orders__network-select {
  max-width: toRem(158);
  width: 100%;
}
</style>
