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
            :list="list"
            @claim-btn-click="claimOrderOrMatch"
          >
            <template #pagination>
              <pagination
                :current-page="currentPage"
                @update:current-page=";(currentPage = $event), loadList()"
                :total-items="totalItems"
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
import { ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { Bus, ErrorHandler, switchNetwork } from '@/helpers'
import ClaimOrderListTable from '@/pages/Claim/ClaimOrderListTable.vue'
import { TxResposne, MatchOrder } from '@/types'
import { callers } from '@/api'
import { useI18n } from 'vue-i18n'

const PAGE_LIMIT = 5

const props = defineProps<{
  chainId: number
}>()

const emit = defineEmits<{
  (e: 'is-loading', value: boolean): void
}>()

const { t } = useI18n({ useScope: 'global' })
const { provider } = useWeb3ProvidersStore()

const currentPage = ref(1)
const totalItems = ref(0)
const isSubmitting = ref(false)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref<MatchOrder[]>([])

const loadList = async () => {
  emit('is-loading', true)
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await callers.get<MatchOrder[]>(
      '/integrations/order-aggregator/claimable',
      {
        params: {
          'filter[creator]': provider.selectedAddress,
          'filter[src_chain]': props.chainId,
          'page[limit]': PAGE_LIMIT,
          'page[number]': currentPage.value - 1,
          include:
            'src_chain,origin_chain,origin_order.token_to_buy,origin_order.token_to_sell',
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
  emit('is-loading', false)
  isLoaded.value = true
}

const claimOrderOrMatch = async (item: MatchOrder) => {
  isSubmitting.value = true
  try {
    const response =
      item.origin_order?.creator === provider.selectedAddress
        ? await getClaimMatch(item)
        : await getClaimOrder(item)
    await provider.signAndSendTx(response.tx_body)
    Bus.success(t('claim-order-list.claimed-msg'))
    loadList()
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

const getClaimMatch = async (item: MatchOrder) => {
  await switchNetwork(item.origin_order?.destination_chain!)
  const { data } = await callers.post<TxResposne>('/v1/execute/match', {
    data: {
      src_chain: item.origin_order?.src_chain?.id,
      dest_chain: item.origin_order?.destination_chain?.id,
      match_id: item.match_id,
      order_id: item.origin_order?.order_id,
      sender: provider.selectedAddress,
      receiver: provider.selectedAddress,
    },
  })
  return data
}

const getClaimOrder = async (item: MatchOrder) => {
  await switchNetwork(item.origin_order?.src_chain!)
  const { data } = await callers.post<TxResposne>('/v1/execute/order', {
    data: {
      src_chain: item.origin_order?.src_chain?.id,
      dest_chain: item.origin_order?.destination_chain?.id,
      match_id: item.match_id,
      order_id: item.origin_order?.order_id,
      sender: provider.selectedAddress,
      receiver: provider.selectedAddress,
    },
  })
  return data
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
