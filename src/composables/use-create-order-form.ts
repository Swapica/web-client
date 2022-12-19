import { useChainsStore } from '@/store'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

export const useCreateOrderForm = () => {
  const { selectedChain } = storeToRefs(useChainsStore())

  const form = reactive({
    networkSell: selectedChain.value?.chain_params.chain_id,
    networkBuy: '',
  })

  return {
    form,
  }
}
