<template>
  <div class="claim-order-list-table">
    <div class="claim-order-list-table__head">
      <div class="claim-order-list-table__head-items-wrp">
        <div class="claim-order-list-table__head-item">
          <span class="claim-order-list-table__head-title">
            {{ $t('claim-order-list-table.original-lbl') }}
          </span>
        </div>
        <div class="claim-order-list-table__head-item">
          <span class="claim-order-list-table__head-title">
            {{ $t('claim-order-list-table.match-lbl') }}
          </span>
        </div>
      </div>
      <div v-if="!isTablet" class="claim-order-list-table__head-item">
        <span class="claim-order-list-table__head-title">
          {{ $t('claim-order-list-table.network-lbl') }}
        </span>
      </div>
    </div>
    <div class="claim-order-list-table__body-wrp">
      <div
        class="claim-order-list-table__body"
        v-for="i in list"
        :key="i.info.id.toString()"
      >
        <claim-order-list-item-info
          :order="'order' in i ? i.order : i"
          :network-sell="getSellNetwork(i)"
          :is-match="Boolean('order' in i)"
        />
        <app-button
          class="claim-order-list-table__body-item-claim-btn"
          :scheme="isTablet ? 'secondary-mobile' : 'secondary'"
          :size="isTablet ? 'default' : 'small'"
          :disabled="isBtnDisabled"
          :text="
            isTablet
              ? $t('claim-order-list-table.claim-order-btn')
              : $t('claim-order-list-table.claim-btn')
          "
          @click="emit('claim-btn-click', i)"
        />
      </div>
    </div>
    <div class="order-list__pagination">
      <slot name="pagination" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AppButton } from '@/common'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { ChainResposne, UserMatch, UserOrder } from '@/types'
import ClaimOrderListItemInfo from '@/pages/Claim/ClaimOrderListItemInfo.vue'
import { useChainsStore } from '@/store'
import { storeToRefs } from 'pinia'

const props = withDefaults(
  defineProps<{
    list: (UserOrder | UserMatch)[]
    networkSell: ChainResposne
    isBtnDisabled?: boolean
  }>(),
  {
    isBtnDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'claim-btn-click', value: UserOrder | UserMatch): void
}>()

const { width: windowWidth } = useWindowSize()
const { chainByChainId } = storeToRefs(useChainsStore())

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)

const getSellNetwork = (i: UserOrder | UserMatch) => {
  return 'order' in i
    ? chainByChainId.value(i.info.originChain.toNumber())!
    : props.networkSell
}
</script>
<style lang="scss" scoped>
.claim-order-list-table {
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

.claim-order-list-table__head {
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

.claim-order-list-table__head-items-wrp {
  display: grid;
  grid-template-columns: minmax(toRem(100), 1fr) minmax(toRem(100), 1fr);
}

.claim-order-list-table__body-wrp {
  grid-area: body;
  display: grid;
  gap: toRem(12);
}

.claim-order-list-table__body {
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

.claim-order-list-table__pagination {
  grid-area: pagination;
}

.claim-order-list-table__head-title {
  font-size: toRem(24);
  line-height: 1;
  color: var(--text-primary-dark);

  @include respond-to(tablet) {
    font-size: toRem(18);
    margin-left: toRem(9);
  }
}

.claim-order-list-table__body-item-claim-btn {
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
