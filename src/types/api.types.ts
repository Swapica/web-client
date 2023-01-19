export type JsonApiRelationship = Record<string, unknown>
export type Uuid = string
export type JsonApiRelationships = Record<
  string,
  JsonApiRelationship | JsonApiRelationship[]
>

export type JsonApiRecordBase<T extends string> = {
  id: Uuid
  type: T
  relationship_names?: JsonApiRelationships
}

type ChainParams = {
  chain_hex_id: string
  chain_id: number
  explorer_url: string
  native_decimals: number
  native_symbol: string
  rpc: string
}

export type ChainResposne = JsonApiRecordBase<'chain'> & {
  chain_type: string
  icon: string
  name: string
  chain_params: ChainParams
  swap_contract: string
}

export type TxBody = {
  from: string
  to: string
  value: string
  data: string
  chain_id: string
}

export type TxResposne = JsonApiRecordBase<'evm_transaction'> & {
  tx_body: TxBody
  confirmed: boolean
}

export type TokenChain = {
  chain_id: string
  token_id: string
  token_type: string
  contract_address: string
}

export type TokenResponse = JsonApiRecordBase<'token'> & {
  icon: string
  name: string
  symbol: string
  token_type: string
  chains: TokenChain[]
}

export type Token = JsonApiRecordBase<'token'> & {
  icon: string
  name: string
  symbol: string
  decimals: number
  token_type: string
  chain: TokenChain
}
