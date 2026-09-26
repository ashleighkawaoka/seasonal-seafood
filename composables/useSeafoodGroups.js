export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Starting at the current month and wrapping around: e.g. 9 → [9,10,11,12,1,2,...,8]
export function monthsInOrder(currentMonth) {
  return Array.from({ length: 12 }, (_, i) => ((currentMonth - 1 + i) % 12) + 1)
}

// Straight-line distance in km between two lat/lng points (haversine formula)
function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

// Adds distances to each water, sorts nearest first, and records the nearest distance
function prepareItem(item, location) {
  const waters = (item.waters ?? [])
    .map((water) => ({
      ...water,
      distance: distanceKm(location.lat, location.lng, water.latitude, water.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)

  return {
    ...item,
    waters,
    nearestDistance: waters.length ? waters[0].distance : Infinity,
  }
}

// Returns [{ month: 9, name: 'September', items: [...] }, ...] in display order
export function buildMonthGroups(items, currentMonth, location) {
  const prepared = items.map((item) => prepareItem(item, location))

  return monthsInOrder(currentMonth)
    .map((month) => ({
      month,
      name: MONTH_NAMES[month - 1],
      items: prepared
        .filter((item) => {
          const months = [...(item.peakMonths ?? []), ...(item.limitedMonths ?? [])]
          return months.includes(month)
        })
        .sort((a, b) => a.nearestDistance - b.nearestDistance),
    }))
    .filter((group) => group.items.length > 0)
}