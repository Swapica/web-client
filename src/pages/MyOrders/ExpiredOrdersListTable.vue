<!-- eslint-disable prettier/prettier -->
<template>
  <div class="expired-orders-list-table">
    <div class="expired-orders-list-table__head">
      <div class="expired-orders-list-table__head-items-wrp">
        <div class="expired-orders-list-table__head-item">
          <span class="expired-orders-list-table__head-title">
            {{ $t('expired-orders-list-table.buy-lbl') }}
          </span>
        </div>
        <div class="expired-orders-list-table__head-item">
          <span class="expired-orders-list-table__head-title">
            {{ $t('expired-orders-list-table.sell-lbl') }}
          </span>
        </div>
      </div>
      <div v-if="!isTablet" class="expired-orders-list-table__head-item">
        <span class="expired-orders-list-table__head-title">
          {{ $t('expired-orders-list-table.network-lbl') }}
        </span>
      </div>
    </div>
    <div class="expired-orders-list-table__body-wrp">
      <div
        class="expired-orders-list-table__body"
        v-for="i in list"
        :key="i.id"
      >
        <div class="expired-orders-list-table__body-item-info-wrp">
          <!-- eslint-disable-next-line max-len -->
          <div class="expired-orders-list-table__body-item-info expired-orders-list-table__body-item-info-buy">
            <span
              class="expired-orders-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.origin_order?.amount_to_buy!,
                  i.origin_order?.token_to_buy.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.origin_order?.amount_to_buy!,
                  i.origin_order?.token_to_buy.decimals,
                )
              }}
            </span>
            <span class="expired-orders-list-table__body-item-code">
              {{ i.origin_order?.token_to_buy.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="expired-orders-list-table__body-item-address"
              :text="i.origin_order?.token_to_buy!"
              :title="i.origin_order?.token_to_buy"
            >
              {{
                $t('expired-orders-list-table.address', {
                  address: cropAddress(i.origin_order?.token_to_buy!, 4, 3),
                })
              }}
            </copy-button>
            <app-button
              class="expired-orders-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :href="provider.getAddressUrl(
                i.src_chain?.chain_params.explorer_url!,
                i.origin_order?.token_to_buy!
              )"
              :icon-left="$icons.link"
            />
          </div>
          <!-- eslint-disable-next-line max-len -->
          <div class="expired-orders-list-table__body-item-info expired-orders-list-table__body-item-info-sell">
            <span
              class="expired-orders-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.origin_order?.amount_to_sell!,
                  i.origin_order?.token_to_sell.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.origin_order?.amount_to_sell!,
                  i.origin_order?.token_to_sell.decimals,
                )
              }}
            </span>
            <span class="expired-orders-list-table__body-item-code">
              {{ i.origin_order?.token_to_sell.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="expired-orders-list-table__body-item-address"
              :text="i.origin_order?.token_to_sell!"
              :title="i.origin_order?.token_to_sell"
            >
              {{
                $t('expired-orders-list-table.address', {
                  address: cropAddress(i.origin_order?.token_to_sell!, 4, 3),
                })
              }}
            </copy-button>
            <app-button
              class="expired-orders-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :icon-left="$icons.link"
              :href="
                provider.getAddressUrl(
                  i.origin_chain?.chain_params
                    .explorer_url!,
                  i.origin_order?.token_to_sell!,
                )
              "
            />
          </div>
        </div>
        <div class="expired-orders-list-table__body-item-network">
          <span
            class="expired-orders-list-table__body-item-network-text"
            :title="
              $t('expired-orders-list-table.network', {
                from: i.origin_chain?.name,
                to: i.src_chain?.name,
              })
            "
          >
            {{
              $t('expired-orders-list-table.network', {
                from: i.origin_chain?.name,
                to: i.src_chain?.name,
              })
            }}
          </span>
        </div>
        <app-button
          class="expired-orders-list-table__body-item-cancel-btn"
          :scheme="isTablet ? 'secondary-mobile' : 'secondary'"
          :size="isTablet ? 'default' : 'small'"
          :disabled="isBtnDisabled"
          :text="
            isTablet
              ? $t('expired-orders-list-table.cancel-order-btn')
              : $t('expired-orders-list-table.cancel-btn')
          "
          @click="emit('cancel-btn-click', i)"
        />
      </div>
    </div>
    <div class="order-list__pagination">
      <slot name="pagination" />
    </div>
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

withDefaults(
  defineProps<{
    list: MatchOrder[]
    isBtnDisabled?: boolean
  }>(),
  {
    isBtnDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'cancel-btn-click', value: MatchOrder): void
}>()

const { width: windowWidth } = useWindowSize()
const { provider } = useWeb3ProvidersStore()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>
<style lang="scss" scoped>
.expired-orders-list-table {
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

.expired-orders-list-table__head {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) toRem(154);
  grid-area: head;
  gap: toRem(32);

  @include respond-to(xmedium) {
    gap: toRem(16);
  }

  @include respond-to(tablet) {
    grid-template-columns: minmax(toRem(100), 1fr);
  }
}

.expired-orders-list-table__head-items-wrp,
.expired-orders-list-table__body-item-info-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.expired-orders-list-table__body-wrp {
  grid-area: body;
  display: grid;
  gap: toRem(12);
}

.expired-orders-list-table__body {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) toRem(154) toRem(95);
  align-items: center;
  gap: toRem(32);

  @include respond-to(xmedium) {
    grid-template-columns: minmax(toRem(100), 1fr) toRem(154) toRem(110);
    gap: toRem(16);
  }

  @include respond-to(tablet) {
    grid-template-columns: minmax(toRem(100), 1fr);
    gap: toRem(4);
  }
}

.expired-orders-list-table__pagination {
  grid-area: pagination;
}

.expired-orders-list-table__head-title {
  font-size: toRem(24);
  line-height: 1;
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    font-size: toRem(18);
    margin-left: toRem(9);
  }
}

.expired-orders-list-table__body-item-info {
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

.expired-orders-list-table__body-item-code {
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

.expired-orders-list-table__body-item-address {
  font-size: toRem(12);
  line-height: 1;
  color: var(--text-primary-main);
}

.expired-orders-list-table__body-item-icon {
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.expired-orders-list-table__body-item-amount {
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

.expired-orders-list-table__body-item-info-buy {
  background: url('/backgrounds/order-5-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(8) toRem(24) toRem(8) toRem(12);

  @include respond-to(small) {
    padding: toRem(8) toRem(4.45) toRem(8) toRem(5);
  }
}

.expired-orders-list-table__body-item-info-sell {
  background: url('/backgrounds/order-6-bg.svg') no-repeat;
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

.expired-orders-list-table__body-item-network {
  background: url('/backgrounds/network-bg.svg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(8) toRem(16);
}

.expired-orders-list-table__body-item-network-text {
  font-size: toRem(16);
  line-height: 1;
  color: var(--text-primary-dark);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.expired-orders-list-table__body-item-cancel-btn {
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
</style>
