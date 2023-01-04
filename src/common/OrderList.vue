<template>
  <div class="order-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="order-list__error-msg"
          :message="$t('order-list.loading-error-msg')"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <order-list-table
            :is-btn-disabled="isSubmitting"
            :network-sell="network!"
            :list="orderList"
            @cancel-btn-click="handleBtnClick"
          >
            <template #pagination>
              <pagination
                v-model:current-page="currentPage"
                :total-items="list.length"
                :page-limit="PAGE_LIMIT"
              />
            </template>
          </order-list-table>
        </template>
        <template v-else>
          <template v-if="$slots.noDataMsg">
            <slot name="noDataMsg" />
          </template>
        </template>
      </template>
    </template>
    <template v-else>
      <loader
        class="order-list__loader"
        :message="$t('order-list.loading-msg')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Loader, Pagination } from '@/common'
import { useSwapica } from '@/composables'
import { ref, watch, computed } from 'vue'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import { storeToRefs } from 'pinia'
import OrderListTable from '@/common/order-list/OrderListTable.vue'
import { ethers } from 'ethers'
import { TxResposne, UserOrder } from '@/types'
import { callers } from '@/api'
import { useI18n } from 'vue-i18n'

const PAGE_LIMIT = 5

const props = defineProps<{
  chainId: number
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { chainByChainId } = storeToRefs(useChainsStore())
const network = computed(() => chainByChainId.value(props.chainId))
const orderList = computed(() => {
  const firstItemIndex = PAGE_LIMIT * (currentPage.value - 1)
  return list.value.slice(firstItemIndex, firstItemIndex + PAGE_LIMIT)
})
const { t } = useI18n({ useScope: 'global' })

const currentPage = ref(1)
const totalItems = ref(0)

const isSubmitting = ref(false)

const emit = defineEmits<{
  (e: 'list-empty', value: boolean): void
  (e: 'load-failed', value: boolean): void
  (e: 'is-loading', value: boolean): void
}>()

const swapicaContract = useSwapica(provider.value)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref<UserOrder[]>([])

const loadList = async () => {
  emit('load-failed', false)
  emit('list-empty', false)
  emit('is-loading', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const rpcProvider = new ethers.providers.JsonRpcProvider(
      network.value?.chain_params.rpc,
    )
    swapicaContract.init(network.value?.swap_contract!, rpcProvider)

    await getTotalItems()

    const data = await loadingOrdersLoop()
    list.value = data.flat().reverse()
    if (!list.value.length) emit('list-empty', true)
  } catch (e) {
    isLoadFailed.value = true
    emit('load-failed', true)
    ErrorHandler.processWithoutFeedback(e)
  }
  emit('is-loading', false)
  isLoaded.value = true
}

const loadingOrdersLoop = async () => {
  const promises = []

  for (let i = 0; i < totalItems.value; i += 100) {
    promises.push(
      swapicaContract.getUserOrders(
        provider.value.selectedAddress!,
        i,
        i + 100,
        network.value!,
      ),
    )
  }
  return Promise.all(promises)
}

const getTotalItems = async () => {
  const data = await swapicaContract.getUserOrdersLength(
    provider.value.selectedAddress!,
  )
  totalItems.value = data?.toNumber() || 0
}

const handleBtnClick = async (item: UserOrder) => {
  isSubmitting.value = true
  try {
    await switchNetwork(network.value!)
    const { data } = await callers.post<TxResposne>('/v1/cancel/order', {
      data: {
        src_chain: network.value?.id,
        order_id: item.info.id.toNumber(),
        sender: provider.value.selectedAddress,
      },
    })
    await provider.value.signAndSendTx(data.tx_body)
    Bus.success(t('order-list.canceled-msg'))
    loadList()
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

Bus.on(Bus.eventList.offerCreated, () => {
  loadList()
})

watch(
  () => [provider.value.selectedAddress, props.chainId],
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
.order-list {
  display: flex;
  flex: 1;
}

.order-list__error-msg {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.order-list__loader {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}
</style>
