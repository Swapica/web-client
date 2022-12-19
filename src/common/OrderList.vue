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
          <order-list-table />
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
import { ErrorMessage, Loader } from '@/common'
import { useSwapica } from '@/composables'
import { ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { storeToRefs } from 'pinia'
import OrderListTable from '@/common/order-list/OrderListTable.vue'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const emit = defineEmits<{
  (e: 'list-empty'): void
  (e: 'load-failed'): void
}>()

const swapicaContract = useSwapica(provider.value)
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const list = ref([])

const loadList = async () => {
  try {
    swapicaContract.init('0x7dC47fBb83Aa9aD72fF87a5Ce1Cd9D521Af3a82a')
    await swapicaContract.getOrders(provider.value.selectedAddress!, 1, 14)
    emit('list-empty')
  } catch (e) {
    isLoadFailed.value = true
    emit('load-failed')
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

loadList()
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
