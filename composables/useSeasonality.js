export const SEASON_COLORS = {
  peak: 'green',
  limited: 'orange',
  frozen: 'yellow',
  none: 'white',
}

// Returns an array of 12 states ('peak' | 'limited' | 'frozen' | 'none'), index 0 = January
export function monthStates(item) {
  const peak = new Set(item.peakMonths ?? [])
  const limited = new Set(item.limitedMonths ?? [])
  const frozen = new Set(item.frozenMonths ?? [])

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    if (peak.has(month)) return 'peak'
    if (limited.has(month)) return 'limited'
    if (frozen.has(month)) return 'frozen'
    return 'none'
  })
}