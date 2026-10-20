export const SITE_NAME = 'Forks and Fishes'

export const SORT_VIEWS = [
  { key: 'taste', title: 'Taste' },
  { key: 'good-for', title: 'Good for' },
  { key: 'seasonality', title: 'Seasonality' },
]


export const TASTE_AXES = [
  {
    key: 'light',
    title: 'Light',
    description:
      'Low in fat with a clean, mild taste. Light fish take on the flavor of whatever they are cooked with.',
  },
  {
    key: 'rich',
    title: 'Rich',
    description:
      'Higher in fat and natural oils, which gives a fuller, more pronounced flavor and a buttery finish.',
  },
  {
    key: 'tender',
    title: 'Tender',
    description:
      'Soft, delicate flesh that needs gentle handling and shorter cooking times so it does not fall apart.',
  },
  {
    key: 'firm',
    title: 'Firm',
    description:
      'Holds its shape under high heat, so it stands up to grilling, searing and skewering.',
  },
  {
    key: 'flaky',
    title: 'Flaky',
    description: 'Separates into thin layers or flakes once cooked, easy to pull apart with a fork.',
  },
  {
    key: 'meaty',
    title: 'Meaty',
    description:
      'Dense, steak-like flesh with a chew that is closer to meat than to a typical white fish.',
  },
]

// Same values as cookingMethodOptions in the Sanity studio
export const COOKING_METHODS = [
  { value: 'grilling', title: 'Grilling' },
  { value: 'baking', title: 'Baking' },
  { value: 'roasting', title: 'Roasting' },
  { value: 'barbecuing', title: 'Barbecuing' },
  { value: 'broiling', title: 'Broiling' },
  { value: 'frying', title: 'Frying' },
  { value: 'searing', title: 'Searing' },
  { value: 'sauteing', title: 'Sautéing' },
  { value: 'poaching', title: 'Poaching' },
  { value: 'steaming', title: 'Steaming' },
  { value: 'smoking', title: 'Smoking' },
  { value: 'pickling', title: 'Pickling' },
  { value: 'soups-stews-chowders', title: 'Soups / Stews / Chowders' },
  { value: 'sushi-sashimi', title: 'Sushi / Sashimi' },
  { value: 'breading', title: 'Breading' },
]

export const MONTHS = [
  { key: 'jan', letter: 'J', abbr: 'Jan', short: 'Jan', name: 'January' },
  { key: 'feb', letter: 'F', abbr: 'Feb', short: 'Feb', name: 'February' },
  { key: 'mar', letter: 'M', abbr: 'Mar', short: 'Mar', name: 'March' },
  { key: 'apr', letter: 'A', abbr: 'Apr', short: 'Apr', name: 'April' },
  { key: 'may', letter: 'M', abbr: 'May', short: 'May', name: 'May' },
  { key: 'jun', letter: 'J', abbr: 'Jun', short: 'June', name: 'June' },
  { key: 'jul', letter: 'J', abbr: 'Jul', short: 'July', name: 'July' },
  { key: 'aug', letter: 'A', abbr: 'Aug', short: 'Aug', name: 'August' },
  { key: 'sep', letter: 'S', abbr: 'Sep', short: 'Sept', name: 'September' },
  { key: 'oct', letter: 'O', abbr: 'Oct', short: 'Oct', name: 'October' },
  { key: 'nov', letter: 'N', abbr: 'Nov', short: 'Nov', name: 'November' },
  { key: 'dec', letter: 'D', abbr: 'Dec', short: 'Dec', name: 'December' },
]

export const SEASON_STATUSES = [
  { value: 'in-season', title: 'In season' },
  { value: 'available', title: 'Available' },
  { value: 'out-of-season', title: 'Out of season' },
]

export const HABITATS = [
  { value: 'saltwater', title: 'Saltwater' },
  { value: 'freshwater', title: 'Freshwater' },
  { value: 'both', title: 'Salt & freshwater' },
]

export function axisTitle(key) {
  return TASTE_AXES.find((axis) => axis.key === key)?.title ?? key
}

export function methodTitle(value) {
  return COOKING_METHODS.find((method) => method.value === value)?.title ?? value
}

// Taste profile tags picked in Sanity, in the same order everywhere
export function tasteTags(fish) {
  const picked = fish.tasteProfile ?? []
  return TASTE_AXES.filter((axis) => picked.includes(axis.key))
}

// monthIndex: 0 = January
export function monthStatus(fish, monthIndex) {
  return fish.freshSeason?.[MONTHS[monthIndex].key] ?? 'out-of-season'
}

export function frozenSummary(frozenMonths = []) {
  if (frozenMonths.length === 12) return 'Frozen: available year-round'
  if (frozenMonths.length === 0) return 'Frozen: not commonly sold'
  return `Frozen: ${frozenMonths.map((m) => MONTHS[m - 1].short).join(', ')}`
}

// Straight-line distance in miles between two { lat, lng } points
export function distanceMiles(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(h))
}
