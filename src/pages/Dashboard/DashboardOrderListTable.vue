<!-- eslint-disable prettier/prettier -->
<template>
  <div class="dashboard-order-list-table">
    <div class="dashboard-order-list-table__head">
      <div class="dashboard-order-list-table__head-item">
        <span class="dashboard-order-list-table__head-title">
          {{ $t('dashboard-order-list-table.sell-lbl') }}
        </span>
      </div>
      <div class="dashboard-order-list-table__head-item">
        <span class="dashboard-order-list-table__head-title">
          {{ $t('dashboard-order-list-table.buy-lbl') }}
        </span>
      </div>
    </div>
    <div class="dashboard-order-list-table__body-wrp">
      <div
        class="dashboard-order-list-table__body"
        v-for="i in list"
        :key="i.info.id.toString()"
      >
        <div class="dashboard-order-list-table__body-item-info-wrp">
          <!-- eslint-disable-next-line max-len -->
          <div class="dashboard-order-list-table__body-item-info dashboard-order-list-table__body-item-info-sell">
            <span
              class="dashboard-order-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.info.amountToSell.toString(),
                  i.tokenToSell.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.info.amountToSell.toString(),
                  i.tokenToSell.decimals,
                )
              }}
            </span>
            <span class="dashboard-order-list-table__body-item-code">
              {{ i.tokenToSell.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="dashboard-order-list-table__body-item-address"
              :text="i.info.tokenToSell"
              :title="i.info.tokenToSell"
            >
              {{
                $t('dashboard-order-list-table.address', {
                  address: isMediumWidth
                    ? cropAddress(i.info.tokenToSell)
                    : cropAddress(i.info.tokenToSell, 7, 12),
                })
              }}
            </copy-button>
            <app-button
              class="dashboard-order-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :icon-left="$icons.link"
              :href="
                getEthExplorerAddressUrl(
                  networkSell.chain_params.explorer_url,
                  i.info.tokenToSell,
                )
              "
            />
          </div>
          <!-- eslint-disable-next-line max-len -->
          <div class="dashboard-order-list-table__body-item-info dashboard-order-list-table__body-item-info-buy">
            <span
              class="dashboard-order-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.info.amountToBuy.toString(),
                  i.tokenToBuy.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.info.amountToBuy.toString(),
                  i.tokenToBuy.decimals,
                )
              }}
            </span>
            <span class="dashboard-order-list-table__body-item-code">
              {{ i.tokenToBuy.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="dashboard-order-list-table__body-item-address"
              :text="i.info.tokenToBuy"
              :title="i.info.tokenToBuy"
            >
              {{
                $t('dashboard-order-list-table.address', {
                  address: isMediumWidth
                    ? cropAddress(i.info.tokenToBuy)
                    : cropAddress(i.info.tokenToBuy, 7, 12),
                })
              }}
            </copy-button>
            <app-button
              class="dashboard-order-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :href="getEthExplorerAddressUrl(
                networkBuy(i.info.destChain.toNumber())
                  ?.chain_params.explorer_url!,
                i.info.tokenToBuy
              )"
              :icon-left="$icons.link"
            />
          </div>
        </div>
        <tooltip
          class="dashboard-order-list-table__tooltip"
          :title="$t('dashboard-order-list-table.tooltip-title')"
          :message="$t('dashboard-order-list-table.tooltip-msg')"
          :is-show-tooltip="!provider.selectedAddress"
        >
          <app-button
            class="dashboard-order-list-table__body-item-match-btn"
            :scheme="isTablet ? 'secondary-mobile' : 'secondary'"
            :size="isTablet ? 'default' : 'small'"
            :disabled="isBtnDisabled || !provider.selectedAddress"
            :text="$t('dashboard-order-list-table.match-btn')"
            @click="emit('btn-click', i)"
          />
        </tooltip>
      </div>
    </div>
    <div class="order-list__pagination">
      <slot name="pagination" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AppButton, CopyButton, Tooltip } from '@/common'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { ChainResposne, UserOrder } from '@/types'
import {
  cropAddress,
  formatWeiAmount,
  getEthExplorerAddressUrl,
} from '@/helpers'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'

withDefaults(
  defineProps<{
    list: UserOrder[]
    networkSell: ChainResposne
    isBtnDisabled?: boolean
  }>(),
  {
    isBtnDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'btn-click', value: UserOrder): void
}>()

const { width: windowWidth } = useWindowSize()
const { chainByChainId } = storeToRefs(useChainsStore())
const { provider } = storeToRefs(useWeb3ProvidersStore())

const networkBuy = (chainId: number) => chainByChainId.value(chainId)

const isMediumWidth = computed(
  () => windowWidth.value < WINDOW_BREAKPOINTS.medium,
)
const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>
<style lang="scss" scoped>
.dashboard-order-list-table {
  display: grid;
  grid-template-columns: 1fr toRem(126);
  grid-template-areas:
    'head pagination'
    'body body';
  width: 100%;
  gap: toRem(24) 0;
  grid-auto-rows: max-content;
  align-items: center;

  @include respond-to(xmedium) {
    gap: toRem(24) 0;
  }

  @include respond-to(tablet) {
    grid-template-columns: minmax(toRem(100), 1fr);
    grid-template-areas:
      'head'
      'body'
      'pagination';
    gap: toRem(16);
  }
}

.dashboard-order-list-table__head {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
  grid-area: head;
}

.dashboard-order-list-table__body-item-info-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.dashboard-order-list-table__body-wrp {
  grid-area: body;
  display: grid;
  gap: toRem(12);
}

.dashboard-order-list-table__body {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) toRem(95);
  align-items: center;
  gap: toRem(32);

  @include respond-to(tablet) {
    grid-template-columns: minmax(toRem(100), 1fr);
    gap: toRem(4);
  }
}

.dashboard-order-list-table__pagination {
  grid-area: pagination;
}

.dashboard-order-list-table__head-title {
  font-size: toRem(24);
  line-height: 1;
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    font-size: toRem(18);
    margin-left: toRem(9);
  }
}

.dashboard-order-list-table__body-item-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: toRem(8);
  width: calc(100% + #{toRem(3)});

  @include respond-to(medium) {
    justify-content: center;
  }

  @include respond-to(tablet) {
    width: calc(100% + #{toRem(5)});
  }

  @include respond-to(small) {
    gap: toRem(4);
    width: calc(100% + #{toRem(1)});
  }
}

.dashboard-order-list-table__body-item-code {
  font-size: toRem(18);
  line-height: 1;
  color: var(--text-primary-dark);
  width: toRem(45);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @include respond-to(small) {
    width: toRem(40);
    font-size: toRem(16);
  }
}

.dashboard-order-list-table__body-item-address {
  font-size: toRem(12);
  line-height: 1;
  color: var(--text-primary-main);
  flex: 1;
  text-align: left;

  @include respond-to(medium) {
    flex: none;
  }
}

.dashboard-order-list-table__body-item-icon {
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.dashboard-order-list-table__body-item-amount {
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

.dashboard-order-list-table__body-item-info-buy {
  background: url('/backgrounds/order-2-bg.svg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: toRem(8) toRem(16) toRem(8) toRem(29);
  left: toRem(-3);

  @include respond-to(tablet) {
    left: toRem(-5);
  }

  @include respond-to(small) {
    left: toRem(-1);
    padding: toRem(8) toRem(4.5) toRem(8) toRem(8);
  }
}

.dashboard-order-list-table__body-item-info-sell {
  background: url('/backgrounds/order-1-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(8) toRem(29) toRem(8) toRem(16);

  @include respond-to(small) {
    padding: toRem(8) toRem(4.45) toRem(8) toRem(5);
  }
}

.dashboard-order-list-table__body-item-match-btn {
  width: 100%;
  height: toRem(40);

  @include respond-to(tablet) {
    height: auto;
    max-width: toRem(293);
    margin: 0 auto;
  }
}

.order-list__pagination {
  margin-left: auto;

  @include respond-to(tablet) {
    margin: toRem(6) auto toRem(16);
  }
}

.dashboard-order-list-table__tooltip {
  @include respond-to(tablet) {
    max-width: toRem(293);
    width: 100%;
    margin: 0 auto;
  }

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  :deep(.tooltip__content) {
    @include respond-to(1200px) {
      bottom: 70%;
      left: -10%;
    }

    @include respond-to(tablet) {
      left: 35%;
    }
  }
}
</style>
