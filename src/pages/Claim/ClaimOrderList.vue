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
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import { storeToRefs } from 'pinia'
import ClaimOrderListTable from '@/pages/Claim/ClaimOrderListTable.vue'
import { ethers } from 'ethers'
import { TxResposne, UserMatch, UserOrder } from '@/types'
import { callers } from '@/api'
import { OrderStatus, MatchStatus } from '@/enums'
import { useI18n } from 'vue-i18n'

const PAGE_LIMIT = 5

const props = defineProps<{
  chainId: number
}>()
const { t } = useI18n({ useScope: 'global' })

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
const list = ref<(UserOrder | UserMatch)[]>([])

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

    const orders = await loadingOrdersLoop()
    const matches = await loadingMatchesLoop()
    const orderList = orders
      .flat()
      .reverse()
      .filter(i => i.matchStatus?.state !== MatchStatus.executed)

    const matchesList = matches
      .flat()
      .filter(i => i.order.orderStatus?.state === OrderStatus.awaitingMatch)
    list.value = [...orderList, ...matchesList]
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

const loadingMatchesLoop = async () => {
  const promises = []

  for (let i = 0; i < totalItems.value; i += 100) {
    promises.push(
      swapicaContract.getUserMatchesWithOrder(
        provider.value.selectedAddress!,
        i,
        i + 100,
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

const handleBtnClick = async (item: UserOrder | UserMatch) => {
  isSubmitting.value = true
  try {
    const response =
      'order' in item ? await getClaimOrder(item) : await getClaimMatch(item)
    await provider.value.signAndSendTx(response.tx_body)
    Bus.success(t('claim-order-list.claimed-msg'))
    loadList()
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

const getClaimMatch = async (item: UserOrder) => {
  const destChain = chainByChainId.value(item.info.destChain.toNumber())
  await switchNetwork(destChain!)
  const { data } = await callers.post<TxResposne>('/v1/execute/match', {
    data: {
      src_chain: network.value?.id,
      dest_chain: destChain?.id,
      match_id: item.orderStatus?.executedBy.toNumber(),
      order_id: item.info.id.toNumber(),
      sender: provider.value.selectedAddress,
      receiver: provider.value.selectedAddress,
    },
  })
  return data
}

const getClaimOrder = async (item: UserMatch) => {
  const srcChain = chainByChainId.value(item.info.originChain.toNumber())
  await switchNetwork(srcChain!)
  const { data } = await callers.post<TxResposne>('/v1/execute/order', {
    data: {
      src_chain: srcChain?.id,
      dest_chain: network.value?.id,
      match_id: item.info.id.toNumber(),
      order_id: item.info.originOrderId.toNumber(),
      sender: provider.value.selectedAddress,
      receiver: provider.value.selectedAddress,
    },
  })
  return data
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
