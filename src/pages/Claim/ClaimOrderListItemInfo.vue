<!-- eslint-disable prettier/prettier -->
<template>
  <div class="claim-order-list-table__body-item-info-wrp">
    <!-- eslint-disable-next-line max-len -->
    <div class="claim-order-list-table__body-item-info claim-order-list-table__body-item-info-buy">
      <span
        class="claim-order-list-table__body-item-amount"
        :title="
          formatWeiAmount(
            order.info.amountToBuy.toString(),
            order.tokenToBuy.decimals,
          )
        "
      >
        {{
          formatWeiAmount(
            order.info.amountToBuy.toString(),
            order.tokenToBuy.decimals,
          )
        }}
      </span>
      <span class="claim-order-list-table__body-item-code">
        {{ order.tokenToBuy.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-table__body-item-address"
        :text="order.info.tokenToBuy"
        :title="order.info.tokenToBuy"
      >
        {{
          $t('claim-order-list-table.address', {
            address: cropAddress(order.info.tokenToBuy, 4, 3),
          })
        }}
      </copy-button>
      <app-button
        class="claim-order-list-table__body-item-icon"
        scheme="icon"
        target="_blank"
        :href="provider.getAddressUrl(
          networkBuy(order.info.destChain.toNumber())
            ?.chain_params.explorer_url!,
          order.info.tokenToBuy
        )"
        :icon-left="$icons.link"
      />
    </div>
    <!-- eslint-disable-next-line max-len -->
    <div class="claim-order-list-table__body-item-info claim-order-list-table__body-item-info-sell">
      <span
        class="claim-order-list-table__body-item-amount"
        :title="
          formatWeiAmount(
            order.info.amountToSell.toString(),
            order.tokenToSell.decimals,
          )
        "
      >
        {{
          formatWeiAmount(
            order.info.amountToSell.toString(),
            order.tokenToSell.decimals,
          )
        }}
      </span>
      <span class="claim-order-list-table__body-item-code">
        {{ order.tokenToSell.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-table__body-item-address"
        :text="order.info.tokenToSell"
        :title="order.info.tokenToSell"
      >
        {{
          $t('claim-order-list-table.address', {
            address: cropAddress(order.info.tokenToSell, 4, 3),
          })
        }}
      </copy-button>
      <app-button
        class="claim-order-list-table__body-item-icon"
        scheme="icon"
        target="_blank"
        :icon-left="$icons.link"
        :href="
          provider.getAddressUrl(
            networkSell.chain_params.explorer_url,
            order.info.tokenToSell,
          )
        "
      />
    </div>
  </div>
  <div class="claim-order-list-table__body-item-network">
    <span
      class="claim-order-list-table__body-item-network-text"
      :title="
        $t('claim-order-list-table.network', {
          from: networkSell.name,
          to: networkBuy(order.info.destChain.toNumber())?.name,
        })
      "
    >
      {{
        $t('claim-order-list-table.network', {
          from: networkSell.name,
          to: networkBuy(order.info.destChain.toNumber())?.name,
        })
      }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import { AppButton, CopyButton } from '@/common'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { ChainResposne, UserOrder } from '@/types'
import { cropAddress, formatWeiAmount } from '@/helpers'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

defineProps<{
  order: UserOrder
  networkSell: ChainResposne
}>()

const { width: windowWidth } = useWindowSize()
const { chainByChainId } = storeToRefs(useChainsStore())
const { provider } = storeToRefs(useWeb3ProvidersStore())

const networkBuy = (chainId: number) => chainByChainId.value(chainId)

const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>
<style lang="scss" scoped>
.claim-order-list-table__body-item-info-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.claim-order-list-table__body-item-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: toRem(4);
  width: calc(100% + #{toRem(3)});

  @include respond-to(tablet) {
    width: calc(100% + #{toRem(5)});
    justify-content: center;
  }

  @include respond-to(small) {
    width: calc(100% + #{toRem(1)});
  }
}

.claim-order-list-table__body-item-code {
  font-size: toRem(18);
  line-height: 1;
  color: var(--text-primary-dark);
  width: toRem(55);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @include respond-to(small) {
    width: toRem(40);
    font-size: toRem(16);
  }
}

.claim-order-list-table__body-item-address {
  font-size: toRem(12);
  line-height: 1;
  color: var(--text-primary-main);
}

.claim-order-list-table__body-item-icon {
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.claim-order-list-table__body-item-amount {
  font-size: toRem(16);
  line-height: 0.9375;
  color: var(--text-primary-dark);
  padding: toRem(5) toRem(8) toRem(4);
  background: url('/backgrounds/input-bg.svg') no-repeat;
  background-size: 100% 100%;
  width: toRem(60);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.claim-order-list-table__body-item-info-buy {
  background: url('/backgrounds/order-1-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(8) toRem(24) toRem(8) toRem(12);

  @include respond-to(small) {
    padding: toRem(8) toRem(4.45) toRem(8) toRem(5);
  }
}

.claim-order-list-table__body-item-info-sell {
  background: url('/backgrounds/order-2-bg.svg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: toRem(8) toRem(18);
  left: toRem(-3);

  @include respond-to(tablet) {
    left: toRem(-5);
  }

  @include respond-to(small) {
    left: toRem(-1);
    padding: toRem(8) toRem(4.5) toRem(8) toRem(8);
  }
}

.claim-order-list-table__body-item-network {
  background: url('/backgrounds/network-bg.svg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(8) toRem(16);
}

.claim-order-list-table__body-item-network-text {
  font-size: toRem(16);
  line-height: 1;
  color: var(--text-primary-dark);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
