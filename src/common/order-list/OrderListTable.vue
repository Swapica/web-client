<!-- eslint-disable prettier/prettier -->
<template>
  <div class="order-list-table">
    <div class="order-list-table__head">
      <div class="order-list-table__head-items-wrp">
        <div class="order-list-table__head-item">
          <span class="order-list-table__head-title">
            {{ $t('order-list-table.buy-lbl') }}
          </span>
        </div>
        <div class="order-list-table__head-item">
          <span class="order-list-table__head-title">
            {{ $t('order-list-table.sell-lbl') }}
          </span>
        </div>
      </div>
      <div v-if="!isTablet" class="order-list-table__head-item">
        <span class="order-list-table__head-title">
          {{ $t('order-list-table.network-lbl') }}
        </span>
      </div>
    </div>
    <div class="order-list-table__body-wrp">
      <div
        class="order-list-table__body"
        v-for="i in list"
        :key="i.id"
      >
        <div class="order-list-table__body-item-info-wrp">
          <!-- eslint-disable-next-line max-len -->
          <div class="order-list-table__body-item-info order-list-table__body-item-info-buy">
            <span
              class="order-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.amount_to_buy,
                  i.token_to_buy.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.amount_to_buy,
                  i.token_to_buy.decimals,
                )
              }}
            </span>
            <span class="order-list-table__body-item-code">
              {{ i.token_to_buy.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="order-list-table__body-item-address"
              :text="i.token_to_buy"
              :title="i.token_to_buy"
            >
              {{
                $t('order-list-table.address', {
                  address: cropAddress(i.token_to_buy, 4, 3),
                })
              }}
            </copy-button>
            <app-button
              class="order-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :href="provider.getAddressUrl(
                i.destination_chain?.chain_params.explorer_url!,
                i.token_to_buy
              )"
              :icon-left="$icons.link"
            />
          </div>
          <!-- eslint-disable-next-line max-len -->
          <div class="order-list-table__body-item-info order-list-table__body-item-info-sell">
            <span
              class="order-list-table__body-item-amount"
              :title="
                formatWeiAmount(
                  i.amount_to_sell,
                  i.token_to_sell.decimals,
                )
              "
            >
              {{
                formatWeiAmount(
                  i.amount_to_sell,
                  i.token_to_sell.decimals,
                )
              }}
            </span>
            <span class="order-list-table__body-item-code">
              {{ i.token_to_sell.symbol }}
            </span>
            <copy-button
              v-if="!isSmall"
              class="order-list-table__body-item-address"
              :text="i.token_to_sell"
              :title="i.token_to_sell"
            >
              {{
                $t('order-list-table.address', {
                  address: cropAddress(i.token_to_sell, 4, 3),
                })
              }}
            </copy-button>
            <app-button
              class="order-list-table__body-item-icon"
              scheme="icon"
              target="_blank"
              :icon-left="$icons.link"
              :href="
                provider.getAddressUrl(
                  i.src_chain?.chain_params.explorer_url!,
                  i.token_to_sell,
                )
              "
            />
          </div>
        </div>
        <div class="order-list-table__body-item-network">
          <span
            class="order-list-table__body-item-network-text"
            :title="
              $t('order-list-table.network', {
                from: i.src_chain?.name,
                to: i.destination_chain?.name,
              })
            "
          >
            {{
              $t('order-list-table.network', {
                from: i.src_chain?.name,
                to: i.destination_chain?.name,
              })
            }}
          </span>
        </div>
        <app-button
          class="order-list-table__body-item-cancel-btn"
          :scheme="isTablet ? 'secondary-mobile' : 'secondary'"
          :size="isTablet ? 'default' : 'small'"
          :disabled="isBtnDisabled"
          :text="
            isTablet
              ? $t('order-list-table.cancel-order-btn')
              : $t('order-list-table.cancel-btn')
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
import { Order } from '@/types'
import { cropAddress, formatWeiAmount } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'

withDefaults(
  defineProps<{
    list: Order[]
    isBtnDisabled?: boolean
  }>(),
  {
    isBtnDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'cancel-btn-click', value: Order): void
}>()

const { width: windowWidth } = useWindowSize()
const { provider } = useWeb3ProvidersStore()

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
</script>
<style lang="scss" scoped>
.order-list-table {
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

.order-list-table__head {
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

.order-list-table__head-items-wrp,
.order-list-table__body-item-info-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.order-list-table__body-wrp {
  grid-area: body;
  display: grid;
  gap: toRem(12);
}

.order-list-table__body {
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

.order-list-table__pagination {
  grid-area: pagination;
}

.order-list-table__head-title {
  font-size: toRem(24);
  line-height: 1;
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    font-size: toRem(18);
    margin-left: toRem(9);
  }
}

.order-list-table__body-item-info {
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

.order-list-table__body-item-code {
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

.order-list-table__body-item-address {
  font-size: toRem(12);
  line-height: 1;
  color: var(--text-primary-main);
}

.order-list-table__body-item-icon {
  width: toRem(20);
  height: toRem(20);
  min-width: toRem(20);
  min-height: toRem(20);
}

.order-list-table__body-item-amount {
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

.order-list-table__body-item-info-buy {
  background: url('/backgrounds/order-1-bg.svg') no-repeat;
  background-size: 100% 100%;
  padding: toRem(8) toRem(24) toRem(8) toRem(12);

  @include respond-to(small) {
    padding: toRem(8) toRem(4.45) toRem(8) toRem(5);
  }
}

.order-list-table__body-item-info-sell {
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

.order-list-table__body-item-network {
  background: url('/backgrounds/network-bg.svg') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(8) toRem(16);
}

.order-list-table__body-item-network-text {
  font-size: toRem(16);
  line-height: 1;
  color: var(--text-primary-dark);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.order-list-table__body-item-cancel-btn {
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
