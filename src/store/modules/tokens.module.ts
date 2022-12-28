import { defineStore } from 'pinia'
import { TokenResponse } from '@/types'
import { callers } from '@/api'

export const useTokensStore = defineStore('tokens-store', {
  state: () => ({
    _tokens: [] as TokenResponse[],
  }),
  actions: {
    async loadTokens() {
      const { data } = await callers.get<TokenResponse[]>('/v1/chains')
      this._tokens = data
    },
  },
  getters: {
    tokens: state => state._tokens,
    tokensByChainId: state => state._tokens,
  },
})
