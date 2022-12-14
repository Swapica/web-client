import { defineStore } from 'pinia'
import { Chain } from '@/types'
import { callers } from '@/api'

export const useChainsStore = defineStore('chains-store', {
  state: () => ({
    _chains: [] as Chain[],
  }),
  actions: {
    async loadChains() {
      const { data } = await callers.get<Chain[]>('/v1/chains')
      this._chains = data
    },
  },
  getters: {
    chains: state => state._chains,
  },
})
