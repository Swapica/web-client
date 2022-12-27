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
          <dashboard-order-list-table :network-sell="network!" :list="list">
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
            :message="$t('dashboard-order-list.no-data-msg')"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <loader
        class="dashboard-order-list__loader"
        :message="$t('dashboard-order-list.loading-msg')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Loader, Pagination, NoDataMessage } from '@/common'
import { useSwapica } from '@/composables'
import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { storeToRefs } from 'pinia'
import DashboardOrderListTable from '@/pages/Dashboard/DashboardOrderListTable.vue'
import { ethers } from 'ethers'
import { ChainResposne, UserOrder } from '@/types'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'

const { width: windowWidth } = useWindowSize()
const isTablet = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.tablet)
const PAGE_LIMIT = isTablet.value ? 5 : 10

const props = defineProps<{
  network: ChainResposne
  tokenBuy: string
  tokenSell: string
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const currentPage = ref(1)
const totalItems = ref(0)

const emit = defineEmits<{
  (e: 'is-loading', value: boolean): void
}>()

const swapicaContract = useSwapica(provider.value)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref<UserOrder[]>([])

const loadList = async () => {
  emit('is-loading', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await getTotalItems()
    const rpcProvider = new ethers.providers.JsonRpcProvider(
      props.network.chain_params.rpc,
    )
    const lastPage = Math.ceil(totalItems.value / PAGE_LIMIT)
    if (currentPage.value > lastPage) {
      currentPage.value = lastPage
    }
    swapicaContract.init(props.network.swap_contract!, rpcProvider)
    const firstItemIndex = totalItems.value - PAGE_LIMIT * currentPage.value
    const data = await swapicaContract.getActiveOrders(
      firstItemIndex < 0 ? 0 : firstItemIndex,
      firstItemIndex + PAGE_LIMIT,
      props.network,
    )
    list.value = data.reverse()
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  emit('is-loading', false)
  isLoaded.value = true
}

const getTotalItems = async () => {
  totalItems.value = 9
}

watch(
  () => [props.tokenSell, props.tokenBuy],
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
</style>
