<template>
  <div class="dashboard-page">
    <div class="dashboard-page__head">
      <div class="dashboard-page__block">
        <div class="dashboard-page__block-title-wrp">
          <span class="dashboard-page__block-title-number">
            {{ $t('dashboard-page.network-title-number-lbl') }}
          </span>
          <p class="dashboard-page__block-title">
            {{ $t('dashboard-page.network-title-lbl') }}
          </p>
        </div>
        <div class="dashboard-page__filters">
          <select-field
            v-model="filters.networkFrom"
            scheme="primary"
            :label="$t('dashboard-page.network-from-lbl')"
            :value-options="networkFromChains"
            :disabled="isSubmitting"
          />
          <select-field
            v-model="filters.networkTo"
            scheme="primary"
            :label="$t('dashboard-page.network-to-lbl')"
            :value-options="networkToChains"
            :disabled="isSubmitting"
          />
        </div>
      </div>
      <div class="dashboard-page__block">
        <div class="dashboard-page__block-title-wrp">
          <!-- eslint-disable-next-line prettier/prettier max-len-->
          <span class="dashboard-page__block-title-number dashboard-page__block-title-number-tokens">
            {{ $t('dashboard-page.tokens-title-number-lbl') }}
          </span>

          <p class="dashboard-page__block-title">
            {{ $t('dashboard-page.tokens-title-lbl') }}
          </p>
        </div>
        <div class="dashboard-page__filters">
          <token-select
            v-model="filters.tokenSell"
            is-head-icon-shown
            size="big"
            is-emit-search-value-on-input
            is-select-all-option-shown
            :placeholder="$t('dashboard-page.token-placeholder')"
            :key="filters.networkFrom"
            :value-options="tokensSell"
            :disabled="isSubmitting"
            :rpc-url="networkFrom?.chain_params.rpc"
            :label="$t('dashboard-page.token-sell-lbl')"
          />
          <token-select
            v-model="filters.tokenBuy"
            is-head-icon-shown
            size="big"
            is-emit-search-value-on-input
            is-select-all-option-shown
            :placeholder="$t('dashboard-page.token-placeholder')"
            :key="filters.networkTo"
            :value-options="tokensBuy"
            :disabled="isSubmitting"
            :rpc-url="networkTo?.chain_params.rpc"
            :label="$t('dashboard-page.token-buy-lbl')"
          />
        </div>
      </div>
    </div>

    <div class="dashboard-page__content-wrp">
      <div class="dashboard-page__title-wrp">
        <h6 class="dashboard-page__title">
          {{ $t('dashboard-page.title') }}
        </h6>
      </div>
      <div class="dashboard-page__content">
        <dashboard-order-list
          v-if="isMounted"
          v-model:is-submitting="isSubmitting"
          :network-sell="networkFrom!"
          :match-network="networkTo!"
          :token-buy="filters.tokenBuy"
          :token-sell="filters.tokenSell"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { useChainsStore, useTokensStore } from '@/store'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { TokenSelect } from '@/common'
import DashboardOrderList from '@/pages/Dashboard/DashboardOrderList.vue'
import { CHAIN_TYPES } from '@/enums'

const { selectedChain, chainById, chains } = useChainsStore()
const { tokensByChainId } = useTokensStore()
const isMounted = ref(false)
const isSubmitting = ref(false)

const filters = reactive({
  networkFrom: '',
  networkTo: '',
  tokenSell: '',
  tokenBuy: '',
})

const networkFromChains = computed(() => getNetworkList(filters.networkTo))
const networkToChains = computed(() => getNetworkList(filters.networkFrom))
const tokensSell = computed(() =>
  tokensByChainId(filters.networkFrom).map(i => ({
    label: i.symbol,
    value: i.chain.contract_address,
    imageUrl: i.icon,
  })),
)

const tokensBuy = computed(() =>
  tokensByChainId(filters.networkTo).map(i => ({
    label: i.symbol,
    value: i.chain.contract_address,
    imageUrl: i.icon,
  })),
)
const networkFrom = computed(() => chainById(filters.networkFrom))
const networkTo = computed(() => chainById(filters.networkTo))

const getNetworkList = (network: string) => {
  const chainList = chains.map(i => ({
    label: i.name,
    value: i.id,
    imageUrl: i.icon,
    type: i.chain_params.chain_type,
  }))
  if (!network) return chainList
  return chainList.filter(i => {
    const networkInfo = chainById(network)

    return (
      i.type === CHAIN_TYPES.testnet ||
      i.type !== networkInfo?.chain_params.chain_type
    )
  })
}

watch(
  () => filters.networkFrom,
  () => (filters.tokenSell = ''),
)

watch(
  () => filters.networkTo,
  () => (filters.tokenBuy = ''),
)

onMounted(() => {
  filters.networkFrom = selectedChain?.id || networkFromChains.value[0].value
  filters.networkTo = networkToChains.value[0].value
  isMounted.value = true
})
</script>
<style lang="scss" scoped>
.dashboard-page__head {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
  gap: toRem(33);
  margin-bottom: toRem(31.5);

  @include respond-to(small) {
    grid-template-columns: minmax(toRem(100), 1fr);
  }
}

.dashboard-page__block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: toRem(13);
}

.dashboard-page__filters {
  background: url('/backgrounds/block-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(24) toRem(22.32) toRem(32.92) toRem(39.02);
  gap: toRem(20);
  display: flex;
  flex-direction: column;

  @include respond-to(small) {
    padding: toRem(24) toRem(16.96) toRem(32.92) toRem(28.13);
  }
}

.dashboard-page__block-title-wrp {
  display: flex;
  align-items: center;
  gap: toRem(8);
}

.dashboard-page__block-title-number {
  font-size: toRem(20);
  line-height: 1;
  color: var(--text-primary-dark);
  padding: toRem(7) toRem(11) toRem(2) toRem(10);
  background: url('/backgrounds/circle-bg.svg') no-repeat;
  background-size: 100% 100%;
}

.dashboard-page__block-title-number-tokens {
  padding: toRem(7) toRem(8) toRem(2) toRem(6);
}

.dashboard-page__block-title {
  color: var(--text-primary-dark);
  font-size: toRem(18);
  line-height: 1;
}

.dashboard-page__title {
  margin-left: toRem(32);
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    margin-left: toRem(12);
  }
}

.dashboard-page__title-wrp {
  margin-bottom: toRem(19.5);
}

.dashboard-page__content {
  background: url('/backgrounds/block-bg.svg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  min-height: toRem(380);
  display: flex;
  padding: toRem(32) toRem(42) toRem(56) toRem(50);

  @include respond-to(tablet) {
    padding: toRem(17) toRem(10) toRem(26) toRem(21);
    min-height: toRem(210);
  }
}
</style>
