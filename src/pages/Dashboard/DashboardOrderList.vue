<template>
  <div class="dashboard-order-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="dashboard-order-list__error-msg"
          :message="$t('dashboard-order-list.loading-error-msg')"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <dashboard-order-list-table
            :list="list"
            @match-btn-click="
              ;(selectedOrder = $event), (isMatchOrderModalShown = true)
            "
          >
            <template #pagination>
              <pagination
                :current-page="currentPage"
                @update:current-page=";(currentPage = $event), loadList()"
                :total-items="totalItems"
                :page-limit="PAGE_LIMIT"
              />
            </template>
          </dashboard-order-list-table>
        </template>
        <template v-else>
          <no-data-message
            class="dashboard-order-list__no-data-block"
            :message="
              provider.isConnected
                ? $t('dashboard-order-list.no-data-connected-msg')
                : $t('dashboard-order-list.no-data-msg')
            "
          >
            <template v-if="provider.isConnected">
              <app-button
                class="dashboard-order-list__no-data-link"
                scheme="primary"
                :text="$t('dashboard-order-list.my-orders-link')"
                :route="{ name: $routes.myOrders }"
              />
            </template>
            <template v-else>
              <connect-wallet-btn />
            </template>
          </no-data-message>
        </template>
      </template>
    </template>
    <template v-else>
      <loader
        class="dashboard-order-list__loader"
        :message="$t('dashboard-order-list.loading-msg')"
      />
    </template>

    <match-order-modal
      v-if="selectedOrder"
      v-model:is-shown="isMatchOrderModalShown"
      :order="selectedOrder"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  ErrorMessage,
  Loader,
  Pagination,
  NoDataMessage,
  MatchOrderModal,
  ConnectWalletBtn,
  AppButton,
} from '@/common'
import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { Bus, ErrorHandler } from '@/helpers'
import DashboardOrderListTable from '@/pages/Dashboard/DashboardOrderListTable.vue'
import { ChainResposne, Order } from '@/types'
import { OrderStatus, WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { callers } from '@/api'

const props = defineProps<{
  networkSell?: ChainResposne
  matchNetwork?: ChainResposne
  tokenBuy?: string
  tokenSell?: string
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:is-submitting', value: boolean): void
}>()

const { provider } = useWeb3ProvidersStore()
const { width: windowWidth } = useWindowSize()

const currentPage = ref(1)
const isMatchOrderModalShown = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref<Order[]>([])
const selectedOrder = ref<Order>()
const totalItems = ref(0)

const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const PAGE_LIMIT = isTablet.value ? 5 : 10

const loadList = async () => {
  emit('update:is-submitting', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await callers.get<Order[]>(
      '/integrations/order-aggregator/orders',
      {
        params: {
          ...(props.networkSell && {
            'filter[src_chain]': props.networkSell.chain_params.chain_id,
          }),
          ...(props.matchNetwork && {
            'filter[destination_chain]':
              props.matchNetwork.chain_params.chain_id,
          }),
          ...(props.tokenBuy && { 'filter[token_to_buy]': props.tokenBuy }),
          ...(props.tokenSell && { 'filter[token_to_sell]': props.tokenSell }),
          'filter[state]': OrderStatus.awaitingMatch,
          'page[limit]': PAGE_LIMIT,
          'page[number]': currentPage.value - 1,
          include: 'src_chain,destination_chain,token_to_buy,token_to_sell',
        },
      },
    )
    if (!data.length && currentPage.value > 1) {
      currentPage.value -= 1
      loadList()
      return
    }
    totalItems.value = meta.count as number
    list.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  emit('update:is-submitting', false)
  isLoaded.value = true
}

Bus.on(Bus.eventList.orderMatched, () => {
  loadList()
})

watch(
  () => [
    props.tokenSell,
    props.tokenBuy,
    props.networkSell,
    props.matchNetwork,
  ],
  () => {
    currentPage.value = 1
    loadList()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.dashboard-order-list {
  display: flex;
  flex: 1;
}

.dashboard-order-list__error-msg {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.dashboard-order-list__loader {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.dashboard-order-list__no-data-link {
  width: toRem(181);
}
</style>
