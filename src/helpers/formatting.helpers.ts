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
