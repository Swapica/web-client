import { BN, BnLike } from '@/utils'

export function cropAddress(
  string: string,
  reduceValueStart = 4,
  reduceValueEnd = 4,
) {
  if (string.length > reduceValueStart + reduceValueEnd) {
    return `${string.slice(0, reduceValueStart)}...${string.slice(
      -reduceValueEnd,
    )}`
  } else {
    return string
  }
}
export function formatWeiAmount(amount: BnLike, decimals: number) {
  const number = new BN(amount).fromFraction(decimals).toFixed(decimals)
  return new BN(number).toDefaultFormat()
}

export function formatAmount(amount: BnLike, decimals: number) {
  const number = new BN(amount).toFixed(decimals)
  return new BN(number).toDefaultFormat()
}
