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
            item.origin_order?.amount_to_sell!,
            item.origin_order?.token_to_sell.decimals,
          )
        "
      >
        {{
          formatWeiAmount(
            item.origin_order?.amount_to_sell!,
            item.origin_order?.token_to_sell.decimals,
          )
        }}
      </span>
      <span class="claim-order-list-item-info__body-item-code">
        {{ item.origin_order?.token_to_sell.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-item-info__body-item-address"
        :text="item.origin_order?.token_to_sell!"
        :title="item.origin_order?.token_to_sell"
      >
        {{
          $t('claim-order-list-item-info.address', {
            address: cropAddress(item.origin_order?.token_to_sell!, 4, 3),
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
            item.origin_order?.src_chain?.chain_params.explorer_url!,
            item.origin_order?.token_to_sell!,
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
            item.origin_order?.amount_to_buy!,
            item.origin_order?.token_to_buy.decimals,
          )
        "
      >
        {{
          formatWeiAmount(
            item.origin_order?.amount_to_buy!,
            item.origin_order?.token_to_buy.decimals,
          )
        }}
      </span>
      <span class="claim-order-list-item-info__body-item-code">
        {{ item.origin_order?.token_to_buy.symbol }}
      </span>
      <copy-button
        v-if="!isSmall"
        class="claim-order-list-item-info__body-item-address"
        :text="item.origin_order?.token_to_buy!"
        :title="item.origin_order?.token_to_buy"
      >
        {{
          $t('claim-order-list-item-info.address', {
            address: cropAddress(item.origin_order?.token_to_buy!, 4, 3),
          })
        }}
      </copy-button>
      <app-button
        class="claim-order-list-item-info__body-item-icon"
        scheme="icon"
        target="_blank"
        :href="provider.getAddressUrl(
          item.origin_order?.destination_chain?.chain_params.explorer_url!,
          item.origin_order?.token_to_buy!
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
        to: item.origin_order?.src_chain?.name,
        from: item.origin_order?.destination_chain?.name,
      })"
    >
      <template #from>
        <span
          class="claim-order-list-item-info__network-lbl"
          :class="{'claim-order-list-item-info__network-lbl--bold': !isMatch }"
        >
          {{ item.origin_order?.destination_chain?.name }}
        </span>
      </template>
      <template #to>
        <span
          class="claim-order-list-item-info__network-lbl"
          :class="{'claim-order-list-item-info__network-lbl--bold': isMatch }"
        >
          {{ item.origin_order?.src_chain?.name }}
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
import { MatchOrder } from '@/types'
import { cropAddress, formatWeiAmount } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

const props = defineProps<{
  item: MatchOrder
}>()

const { width: windowWidth } = useWindowSize()
const { provider } = useWeb3ProvidersStore()

const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
const isMatch = computed(
  () => props.item.origin_order?.creator === provider.selectedAddress,
)
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
