import { defineStore } from 'pinia'
import { Token, TokenResponse } from '@/types'
import { callers } from '@/api'

export const useTokensStore = defineStore('tokens-store', {
  state: () => ({
    _tokens: [] as TokenResponse[],
  }),
  actions: {
    async loadTokens() {
      const { data } = await callers.get<TokenResponse[]>('/v1/tokens', {
        params: {
          'page[limit]': 100,
          include: 'token_chain',
        },
      })
      this._tokens = data
    },
  },
  getters: {
    tokens: state => state._tokens,
    tokensByChainId: state => (id: string) =>
      state._tokens.reduce<Token[]>((acc, num) => {
        const chainInfo = num.chains.find(i => i.chain_id === id)
        return chainInfo
          ? acc.concat({
              ...num,
              chain: chainInfo,
            })
          : acc
      }, []),
    tokenByAddressAndChainId() {
      return (address: string, chainId: string) => {
        const tokens = this.tokensByChainId(chainId)
        return tokens.find(i => i.chain.contract_address === address)
      }
    },
  },
})
