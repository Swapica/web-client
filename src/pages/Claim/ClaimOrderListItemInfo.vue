<!-- eslint-disable prettier/prettier -->
<template>
  <div class="claim-order-list-item-info__body-item-info-wrp">
    <!-- eslint-disable max-len -->
    <div
      class="claim-order-list-item-info__body-item-info claim-order-list-item-info__body-item-info-buy"
      :class="{ 'claim-order-list-item-info__body-item-info--disabled': !isMatch }"
    >
      <span
        class="claim-order-list-item-info__body-item-amount"
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
      <span class="claim-order-list-item-info__body-item-code">
        {{ order.tokenToSell.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-item-info__body-item-address"
        :text="order.info.tokenToSell"
        :title="order.info.tokenToSell"
      >
        {{
          $t('claim-order-list-item-info.address', {
            address: cropAddress(order.info.tokenToSell, 4, 3),
          })
        }}
      </copy-button>
      <app-button
        class="claim-order-list-item-info__body-item-icon"
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
    <div
      class="claim-order-list-item-info__body-item-info claim-order-list-item-info__body-item-info-sell"
      :class="{ 'claim-order-list-item-info__body-item-info--disabled': isMatch }"
    >
      <span
        class="claim-order-list-item-info__body-item-amount"
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
      <span class="claim-order-list-item-info__body-item-code">
        {{ order.tokenToBuy.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-item-info__body-item-address"
        :text="order.info.tokenToBuy"
        :title="order.info.tokenToBuy"
      >
        {{
          $t('claim-order-list-item-info.address', {
            address: cropAddress(order.info.tokenToBuy, 4, 3),
          })
        }}
      </copy-button>
      <app-button
        class="claim-order-list-item-info__body-item-icon"
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
  </div>
  <div class="claim-order-list-item-info__body-item-network">
    <i18n-t
      keypath="claim-order-list-item-info.network"
      tag="p"
      class="claim-order-list-item-info__body-item-network-text"
      :title="$t('claim-order-list-item-info.network', {
        to: networkSell.name,
        from: networkBuy(order.info.destChain.toNumber())?.name,
      })"
    >
      <template #from>
        <span
          class="claim-order-list-item-info__network-lbl"
          :class="{'claim-order-list-item-info__network-lbl--bold': !isMatch }"
        >
          {{ networkBuy(order.info.destChain.toNumber())?.name }}
        </span>
      </template>
      <template #to>
        <span
          class="claim-order-list-item-info__network-lbl"
          :class="{'claim-order-list-item-info__network-lbl--bold': isMatch }"
        >
          {{ networkSell.name }}
        </span>
      </template>
    </i18n-t>
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

defineProps<{
  order: UserOrder
  networkSell: ChainResposne
  isMatch: boolean
}>()

const { width: windowWidth } = useWindowSize()
const { chainByChainId } = useChainsStore()
const { provider } = useWeb3ProvidersStore()

const networkBuy = (chainId: number) => chainByChainId(chainId)

const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>
<style lang="scss" scoped>
.claim-order-list-item-info__body-item-info-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.claim-order-list-item-info__body-item-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: toRem(4);
  width: calc(100% + #{toRem(3)});

  &--disabled {
    opacity: 0.4;
  }

  @include respond-to(tablet) {
    width: calc(100% + #{toRem(5)});
    justify-content: center;
  }

  @include respond-to(small) {
    width: calc(100% + #{toRem(1)});
  }
}

.claim-order-list-item-info__body-item-code {
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

.claim-order-list-item-info__body-item-address {
  font-size: toRem(12);
  line-height: 1;
  color: var(--text-primary-main);
}

.claim-order-list-item-info__body-item-icon {
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.claim-order-list-item-info__body-item-amount {
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

.claim-order-list-item-info__body-item-info-buy {
  background: url('/backgrounds/order-3-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(8) toRem(24) toRem(8) toRem(12);

  &.claim-order-list-item-info__body-item-info--disabled {
    background: url('/backgrounds/order-5-bg.svg') no-repeat;
  }

  @include respond-to(small) {
    padding: toRem(8) toRem(4.45) toRem(8) toRem(5);
  }
}

.claim-order-list-item-info__body-item-info-sell {
  background: url('/backgrounds/order-4-bg.svg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: toRem(8) toRem(18);
  left: toRem(-3);

  &.claim-order-list-item-info__body-item-info--disabled {
    background: url('/backgrounds/order-2-bg.svg') no-repeat;
  }

  @include respond-to(tablet) {
    left: toRem(-5);
  }

  @include respond-to(small) {
    left: toRem(-1);
    padding: toRem(8) toRem(4.5) toRem(8) toRem(8);
  }
}

.claim-order-list-item-info__body-item-network {
  background: url('/backgrounds/network-bg.svg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(8) toRem(16);
}

.claim-order-list-item-info__body-item-network-text {
  font-size: toRem(16);
  line-height: 1;
  /* stylelint-disable-next-line scale-unlimited/declaration-strict-value */
  color: rgba(var(--primary-dark-rgb), 0.3);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.claim-order-list-item-info__network-lbl {
  font-size: inherit;
  line-height: inherit;

  &--bold {
    color: var(--text-primary-dark);
  }
}
</style>
