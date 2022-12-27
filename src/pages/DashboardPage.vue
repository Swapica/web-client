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
            :value-options="chains"
          />
          <select-field
            v-model="filters.networkTo"
            scheme="primary"
            :label="$t('dashboard-page.network-to-lbl')"
            :value-options="chains"
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
            :value-options="[
              {
                value: '0xd33b754F4dC75E116c2CC366b4C930EB02C7b16f',
                label: 'USDC',
              },
            ]"
            :rpc-url="networkFrom?.chain_params.rpc"
            :label="$t('dashboard-page.token-sell-lbl')"
          />
          <token-select
            v-model="filters.tokenBuy"
            is-head-icon-shown
            size="big"
            :value-options="[
              {
                value: '0xd33b754F4dC75E116c2CC366b4C930EB02C7b16f',
                label: 'USDC',
              },
            ]"
            :rpc-url="networkTo?.chain_params.rpc"
            :label="$t('dashboard-page.token-buy-lbl')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { useChainsStore } from '@/store'
import { computed, reactive } from 'vue'
import { TokenSelect } from '@/common'

const chainStore = useChainsStore()
const chains = computed(() =>
  chainStore.chains.map(i => ({
    label: i.name,
    value: i.id,
    imageUrl: i.icon,
  })),
)

const filters = reactive({
  networkFrom: chainStore.selectedChain?.id ?? '',
  networkTo: chains.value[0].value,
  tokenSell: '',
  tokenBuy: '',
})

const networkFrom = computed(() => chainStore.chainById(filters.networkFrom))
const networkTo = computed(() => chainStore.chainById(filters.networkTo))
</script>
<style lang="scss" scoped>
.dashboard-page__head {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
  gap: toRem(33);
  margin-bottom: toRem(24);
}

.dashboard-page__block {
  display: flex;
  flex-direction: column;
  gap: toRem(13);
}

.dashboard-page__filters {
  background: url('/backgrounds/block-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(24) toRem(22.32) toRem(32.92) toRem(39.02);
  gap: toRem(20);
  display: flex;
  flex-direction: column;
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
</style>
