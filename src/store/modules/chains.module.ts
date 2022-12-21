import { defineStore } from 'pinia'
import { ChainResposne } from '@/types'
import { callers } from '@/api'

export const useChainsStore = defineStore('chains-store', {
  state: () => ({
    _chains: [] as ChainResposne[],
    _selectedChain: null as ChainResposne | null,
  }),
  actions: {
    async loadChains() {
      const { data } = await callers.get<ChainResposne[]>('/v1/chains')
      this._chains = data
    },
    selectChain(chainId: number) {
      const chain = this._chains.find(i => i.chain_params.chain_id == +chainId)
      this._selectedChain = chain || null
    },
  },
  getters: {
    chains: state => state._chains,
    chainById: state => (id: string) => state._chains.find(i => i.id === id),
    chainByChainId: state => (id: number) =>
      state._chains.find(i => i.chain_params.chain_id === id),
    selectedChain: state => state._selectedChain,
  },
})
