import { useChainsStore, useWeb3ProvidersStore } from '@/store'
import { reactive, computed } from 'vue'
import { callers } from '@/api'
import { TxResposne } from '@/types'
import { BN } from '@/utils'
import { getTokenInfo } from '@/helpers'

export const useCreateOrderForm = () => {
  const { selectedChain, chainById } = useChainsStore()
  const { provider } = useWeb3ProvidersStore()

  const networkSell = computed(() => chainById(form.networkSell))
  const networkBuy = computed(() => chainById(form.networkBuy))

  const form = reactive({
    networkSell: selectedChain?.id || '',
    networkBuy: '',
    amountSell: '',
    amountBuy: '',
    tokenSell: '',
    tokenBuy: '',
    isAutomaticClaim: false,
  })

  const createOrder = async () => {
    const [tokenToSell, tokenToBuy] = await Promise.all([
      getTokenInfo(networkSell.value!, form.tokenSell),
      getTokenInfo(networkBuy.value!, form.tokenBuy),
    ])
    return callers.post<TxResposne>('/v1/create/order', {
      data: {
        src_chain: form.networkSell,
        token_to_sell: form.tokenSell,
        amount_to_sell: new BN(form.amountSell)
          .toFraction(tokenToSell?.decimals)
          .toString(),
        token_to_buy: form.tokenBuy,
        amount_to_buy: new BN(form.amountBuy)
          .toFraction(tokenToBuy?.decimals)
          .toString(),
        dest_chain: form.networkBuy,
        sender: provider.selectedAddress,
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
