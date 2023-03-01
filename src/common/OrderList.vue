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
            :list="list"
            @cancel-btn-click="cancelOrder"
          >
            <template #pagination>
              <pagination
                :current-page="currentPage"
                @update:current-page=";(currentPage = $event), loadList()"
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
import { ref, watch, computed } from 'vue'
import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import OrderListTable from '@/common/order-list/OrderListTable.vue'
import { Order, TxResposne } from '@/types'
import { callers } from '@/api'
import { useI18n } from 'vue-i18n'
import { OrderStatus } from '@/enums'

const PAGE_LIMIT = 5

const props = defineProps<{
  chainId: number
}>()

const emit = defineEmits<{
  (e: 'list-empty', value: boolean): void
  (e: 'load-failed', value: boolean): void
  (e: 'is-loading', value: boolean): void
}>()

const { provider } = useWeb3ProvidersStore()
const { chainByChainId } = useChainsStore()
const { t } = useI18n({ useScope: 'global' })

const srcChain = computed(() => chainByChainId(props.chainId))

const currentPage = ref(1)
const isSubmitting = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const totalItems = ref(0)
const list = ref<Order[]>([])

const loadList = async () => {
  emit('load-failed', false)
  emit('list-empty', false)
  emit('is-loading', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await callers.get<Order[]>(
      '/integrations/order-aggregator/orders',
      {
        params: {
          'filter[creator]': provider.selectedAddress,
          'filter[src_chain]': props.chainId,
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
    if (!list.value.length) emit('list-empty', true)
  } catch (e) {
    isLoadFailed.value = true
    emit('load-failed', true)
    ErrorHandler.processWithoutFeedback(e)
  }
  emit('is-loading', false)
  isLoaded.value = true
}

const cancelOrder = async (item: Order) => {
  isSubmitting.value = true
  try {
    await switchNetwork(srcChain.value!)
    const { data } = await callers.post<TxResposne>('/v1/cancel/order', {
      data: {
        src_chain: srcChain.value?.id,
        order_id: item.order_id,
        sender: provider.selectedAddress,
      },
    })
    await provider.signAndSendTx(data.tx_body)
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
  () => [provider.selectedAddress, props.chainId],
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
