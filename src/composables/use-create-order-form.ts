import { useChainsStore } from '@/store'
import { reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'

export const useCreateOrderForm = () => {
  const { selectedChain, chainById } = storeToRefs(useChainsStore())

  const networkSell = computed(() => chainById.value(+form.networkSell))
  const networkBuy = computed(() => chainById.value(+form.networkBuy))

  const form = reactive({
    networkSell: selectedChain.value?.chain_params.chain_id || '',
    networkBuy: '',
    amountSell: '',
    amountBuy: '',
    tokenSell: '',
    tokenBuy: '',
  })

  return {
    form,
    networkSell,
    networkBuy,
  }
}
