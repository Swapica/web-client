import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { callers } from '@/api'
import { TxResposne } from '@/types'

export const useCreateOrderForm = () => {
  const { selectedChain, chainById } = storeToRefs(useChainsStore())
  const { provider } = storeToRefs(useWeb3ProvidersStore())

  const networkSell = computed(() => chainById.value(form.networkSell))
  const networkBuy = computed(() => chainById.value(form.networkBuy))

  const form = reactive({
    networkSell: selectedChain.value?.id || '',
    networkBuy: '',
    amountSell: '',
    amountBuy: '',
    tokenSell: '',
    tokenBuy: '',
  })

  const createOrder = () => {
    return callers.post<TxResposne>('/v1/create/order', {
      data: {
        src_chain: form.networkSell,
        token_to_sell: form.tokenSell,
        amount_to_sell: String(form.amountSell),
        token_to_buy: form.tokenBuy,
        amount_to_buy: String(form.amountBuy),
        dest_chain: form.networkBuy,
        sender: provider.value.selectedAddress,
      },
    })
  }

  return {
    form,
    networkSell,
    networkBuy,
    createOrder,
  }
}
