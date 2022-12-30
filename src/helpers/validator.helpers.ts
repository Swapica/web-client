import { ethers } from 'ethers'

export function isEthAddress(address: string) {
  return ethers.utils.isAddress(address)
}
