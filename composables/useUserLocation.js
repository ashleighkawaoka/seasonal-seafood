const STORAGE_KEY = 'seafood-location'

// Photon (OpenStreetMap) finds nearby places and names GPS positions
const PHOTON_URL = 'https://photon.komoot.io'
const PLACE_TAGS = 'osm_tag=place:city&osm_tag=place:town'
const NEARBY_COUNT = 6
const NEARBY_RADIUS_KM = 40
// Search results within this distance of the current location are listed first
const NEARBY_SEARCH_MILES = 150

const DEFAULT_LOCATION = {
  name: 'Los Angeles, CA',
  lat: 34.0522,
  lng: -118.2437,
  timeZone: 'America/Los_Angeles',
}

const STATE_CODES = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', 'District of Columbia': 'DC',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN',
  Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI',
  Wyoming: 'WY', 'Puerto Rico': 'PR',
}

function monthIn(timeZone) {
  try {
    return Number(
      new Intl.DateTimeFormat('en-US', { timeZone, month: 'numeric' }).format(new Date()),
    )
  } catch {
    return new Date().getMonth() + 1
  }
}

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// "Burbank, CA" style label from a Photon result
function placeName(props) {
  const name = props.city ?? props.name
  const region = STATE_CODES[props.state] ?? props.state
  return [name, region].filter(Boolean).join(', ')
}

function toPlace(feature) {
  const [lng, lat] = feature.geometry.coordinates
  return { name: placeName(feature.properties), lat, lng }
}

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

async function lookupTimeZone(lat, lng) {
  try {
    const data = await getJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&timezone=auto&forecast_days=1`,
    )
    return data.timezone ?? browserTimeZone()
  } catch {
    return browserTimeZone()
  }
}

// Turns GPS coordinates into the city they fall in
async function lookupPlaceName(lat, lng) {
  try {
    const data = await getJson(`${PHOTON_URL}/reverse?lat=${lat}&lon=${lng}&lang=en`)
    const feature = data.features?.[0]
    return feature ? placeName(feature.properties) : null
  } catch {
    return null
  }
}

export function useUserLocation() {
  // Grab these during setup, they can't be looked up later inside click handlers
  const router = useRouter()
  const route = useRoute()
  const location = useState('user-location', () => ({ ...DEFAULT_LOCATION }))
  const status = useState('user-location-status', () => 'idle')
  const message = useState('user-location-message', () => '')
  const nearby = useState('user-location-nearby', () => ({ key: null, places: [], loading: false }))

  const currentMonth = computed(() => monthIn(location.value.timeZone))

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
      return null
    }
  }

  // Puts the current location into the URL so the page becomes shareable
  function syncToUrl(next) {
    router.replace({
      query: {
        ...route.query,
        loc: next.name,
        lat: next.lat,
        lng: next.lng,
        tz: next.timeZone,
      },
    })
  }

  async function chooseLocation(next) {
    const place = next.timeZone ? next : { ...next, timeZone: await lookupTimeZone(next.lat, next.lng) }
    location.value = place
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(place))
    } catch {}
    syncToUrl(place)
  }

  function detectLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(false)
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          const next = {
            name: (await lookupPlaceName(lat, lng)) ?? 'Current Location',
            lat,
            lng,
            timeZone: browserTimeZone(),
          }
          location.value = next
          syncToUrl(next)
          resolve(true)
        },
        () => resolve(false),
        { timeout: 8000, maximumAge: 60 * 60 * 1000 },
      )
    })
  }

  async function useMyLocation() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    status.value = 'locating'
    const ok = await detectLocation()
    message.value = ok ? '' : 'Could not determine your location. Please check permissions.'
    status.value = 'ready'
  }

  // Priority: URL (shared link) → saved choice → geolocation → default
  async function init() {
    const { loc, lat, lng, tz } = route.query

    if (loc && lat && lng && tz) {
      location.value = { name: loc, lat: Number(lat), lng: Number(lng), timeZone: tz }
      status.value = 'ready'
      return
    }

    const saved = readSaved()
    if (saved) {
      location.value = saved
      status.value = 'ready'
      return
    }

    location.value = { ...location.value, timeZone: browserTimeZone() }

    status.value = 'locating'
    const ok = await detectLocation()
    if (!ok) message.value = 'Could not determine your location. You can choose a city instead.'
    status.value = 'ready'
  }

  // US cities from Open-Meteo (fast, and includes each city's time zone).
  // Biggest cities first, with anything near the current location moved to the top.
  async function searchCities(query) {
    const term = query.trim().toLowerCase()
    if (term.length < 2) return []
    const data = await getJson(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=20&language=en&format=json&countryCode=US`,
    )
    const isNear = (r) => distanceMiles(location.value, { lat: r.latitude, lng: r.longitude }) < NEARBY_SEARCH_MILES
    const places = (data.results ?? [])
      // Only towns and cities whose name matches, not parks, zoos or alternate names
      .filter((r) => r.feature_code?.startsWith('PPL') && r.name.toLowerCase().includes(term))
      .sort((a, b) => isNear(b) - isNear(a) || (b.population ?? 0) - (a.population ?? 0))
      .map((r) => ({
        name: [r.name, STATE_CODES[r.admin1] ?? r.admin1].filter(Boolean).join(', '),
        lat: r.latitude,
        lng: r.longitude,
        timeZone: r.timezone,
      }))
    // The same city can come back more than once, keep the first
    return places.filter((place, i) => places.findIndex((p) => p.name === place.name) === i).slice(0, 6)
  }

  // The closest cities and towns to the current location, refreshed when it changes
  async function loadNearby() {
    const { lat, lng, name, timeZone } = location.value
    const key = `${lat},${lng}`
    if (nearby.value.key === key) return

    nearby.value = { key, places: [], loading: true }
    let places = []
    try {
      const data = await getJson(
        `${PHOTON_URL}/reverse?lat=${lat}&lon=${lng}&limit=${NEARBY_COUNT + 2}&radius=${NEARBY_RADIUS_KM}&lang=en&${PLACE_TAGS}`,
      )
      places = (data.features ?? [])
        .map(toPlace)
        .filter((place) => place.name !== name)
        .slice(0, NEARBY_COUNT)
        // Places this close share the current time zone
        .map((place) => ({ ...place, timeZone }))
    } catch {}

    // Ignore the answer if the location changed while it was loading
    if (nearby.value.key === key) nearby.value = { key, places, loading: false }
  }

  return {
    location,
    status,
    message,
    currentMonth,
    nearby,
    init,
    useMyLocation,
    chooseLocation,
    searchCities,
    loadNearby,
  }
}
