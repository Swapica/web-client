<template>
  <div class="claim-order-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="claim-order-list__error-msg"
          :message="$t('claim-order-list.loading-error-msg')"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <claim-order-list-table
            :is-btn-disabled="isSubmitting"
            :network-sell="network!"
            :list="orderList"
            @claim-btn-click="handleBtnClick"
          >
            <template #pagination>
              <pagination
                v-model:current-page="currentPage"
                :total-items="list.length"
                :page-limit="PAGE_LIMIT"
              />
            </template>
          </claim-order-list-table>
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
        class="claim-order-list__loader"
        :message="$t('claim-order-list.loading-msg')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Loader, Pagination } from '@/common'
import { useSwapica } from '@/composables'
import { ref, watch, computed } from 'vue'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, switchNetwork } from '@/helpers'
import { storeToRefs } from 'pinia'
import ClaimOrderListTable from '@/pages/Claim/ClaimOrderListTable.vue'
import { ethers } from 'ethers'
import { TxResposne, UserOrder } from '@/types'
import { callers } from '@/api'
import { OrderStatus } from '@/enums'

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

const currentPage = ref(1)
const totalItems = ref(0)

const isSubmitting = ref(false)

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
    const rpcProvider = new ethers.providers.JsonRpcProvider(
      network.value?.chain_params.rpc,
    )
    swapicaContract.init(network.value?.swap_contract!, rpcProvider)

    await getTotalItems()

    const data = await loadingOrdersLoop()
    list.value = data.flat().reverse()
  } catch (e) {
    isLoadFailed.value = true
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
        OrderStatus.executed,
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
    const destChain = chainByChainId.value(item.info.destChain.toNumber())
    await switchNetwork(destChain!)
    const { data } = await callers.post<TxResposne>('/v1/execute/match', {
      data: {
        src_chain: network.value?.id,
        dest_chain: destChain?.id,
        match_id: 27,
        order_id: item.info.id.toNumber(),
        sender: provider.value.selectedAddress,
        receiver: provider.value.selectedAddress,
      },
    })
    await provider.value.signAndSendTx(data.tx_body)
    loadList()
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

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
.claim-order-list {
  display: flex;
  flex: 1;
}

.claim-order-list__error-msg {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.claim-order-list__loader {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}
</style>
