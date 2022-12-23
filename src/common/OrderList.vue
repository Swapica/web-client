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
          <order-list-table :network-sell="network!" :list="list">
            <template #pagination>
              <pagination
                v-model:current-page="currentPage"
                :total-items="totalItems"
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
import { Bus, ErrorHandler } from '@/helpers'
import { storeToRefs } from 'pinia'
import OrderListTable from '@/common/order-list/OrderListTable.vue'
import { ethers } from 'ethers'
import { UserOrder } from '@/types'

const PAGE_LIMIT = 5

const props = defineProps<{
  chainId: number
}>()

const { provider } = storeToRefs(useWeb3ProvidersStore())
const { chainByChainId } = storeToRefs(useChainsStore())
const network = computed(() => chainByChainId.value(props.chainId))

const currentPage = ref(1)
const totalItems = ref(7)

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
    const beginIndex = totalItems.value - PAGE_LIMIT * currentPage.value
    const data = await swapicaContract.getUserOrders(
      provider.value.selectedAddress!,
      beginIndex < 0 ? 0 : beginIndex,
      beginIndex + PAGE_LIMIT,
    )
    list.value = data.reverse()
    if (!data.length) emit('list-empty', true)
  } catch (e) {
    isLoadFailed.value = true
    emit('load-failed', true)
    ErrorHandler.processWithoutFeedback(e)
  }
  emit('is-loading', false)
  isLoaded.value = true
}

Bus.on(Bus.eventList.offerCreated, () => {
  loadList()
})

watch(
  () => [provider.value.selectedAddress, props.chainId, currentPage.value],
  (value, oldValue) => {
    if (
      (oldValue && oldValue[0] !== value[0]) ||
      (oldValue && oldValue[1] !== value[1])
    ) {
      currentPage.value = 1
    }
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
