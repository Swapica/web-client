import { ethers } from 'ethers'

export function isEthAddress(address: string) {
  return ethers.utils.isAddress(address)
}

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined
}
