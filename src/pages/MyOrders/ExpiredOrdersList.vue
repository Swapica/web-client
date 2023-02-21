<template>
  <div class="expired-orders-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          class="expired-orders-list__error-msg"
          :message="$t('expired-orders-list.loading-error-msg')"
        />
      </template>
      <template v-else>
        <template v-if="list.length">
          <expired-orders-list-table
            :is-btn-disabled="isSubmitting"
            :list="list"
            @cancel-btn-click="cancelMatch"
          >
            <template #pagination>
              <pagination
                :current-page="currentPage"
                @update:current-page=";(currentPage = $event), loadList()"
                :total-items="totalItems"
                :page-limit="PAGE_LIMIT"
              />
            </template>
          </expired-orders-list-table>
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
        class="expired-orders-list__loader"
        :message="$t('expired-orders-list.loading-msg')"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Loader, Pagination } from '@/common'
import { ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import ExpiredOrdersListTable from '@/pages/MyOrders/ExpiredOrdersListTable.vue'
import { TxResposne, MatchOrder } from '@/types'
import { callers } from '@/api'
import { useI18n } from 'vue-i18n'

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
const { t } = useI18n({ useScope: 'global' })

const currentPage = ref(1)
const totalItems = ref(0)
const isSubmitting = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref<MatchOrder[]>([])

const loadList = async () => {
  emit('load-failed', false)
  emit('list-empty', false)
  emit('is-loading', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await callers.get<MatchOrder[]>(
      '/integrations/order-aggregator/match_orders',
      {
        params: {
          'filter[creator]': provider.selectedAddress,
          'filter[src_chain]': props.chainId,
          'filter[expired]': true,
          'page[limit]': PAGE_LIMIT,
          'page[number]': currentPage.value - 1,
          include: 'src_chain,origin_chain,origin_order',
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

const cancelMatch = async (item: MatchOrder) => {
  isSubmitting.value = true
  try {
    await switchNetwork(item.src_chain!)
    const { data } = await callers.post<TxResposne>('/v1/cancel/match', {
      data: {
        dest_chain: item.src_chain?.id,
        src_chain: item.origin_chain?.id,
        match_id: item.match_id,
        sender: provider.selectedAddress,
      },
    })
    await provider.signAndSendTx(data.tx_body)
    Bus.success(t('expired-orders-list.canceled-msg'))
    loadList()
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

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
.expired-orders-list {
  display: flex;
  flex: 1;
}

.expired-orders-list__error-msg {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}

.expired-orders-list__loader {
  max-width: toRem(353);
  margin: 0 auto;

  @include respond-to(small) {
    max-width: toRem(245);
  }
}
</style>
