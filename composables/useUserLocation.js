const STORAGE_KEY = 'seafood-location'

const DEFAULT_LOCATION = {
  name: 'Los Angeles',
  lat: 34.0522,
  lng: -118.2437,
  timeZone: 'America/Los_Angeles',
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

export function useUserLocation() {
  const location = useState('user-location', () => ({ ...DEFAULT_LOCATION }))
  const status = useState('user-location-status', () => 'idle')
  const message = useState('user-location-message', () => '')

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
    const router = useRouter()
    const route = useRoute()
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

  function chooseLocation(next) {
    location.value = next
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
    syncToUrl(next)
  }

  function detectLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(false)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = {
            name: 'Current Location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    const route = useRoute()
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

    location.value = {
      ...location.value,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    status.value = 'locating'
    const ok = await detectLocation()
    if (!ok) message.value = 'Could not determine your location. You can choose a city instead.'
    status.value = 'ready'
  }

  async function searchCities(query) {
    if (query.trim().length < 2) return []
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
    const data = await (await fetch(url)).json()
    return (data.results ?? []).map((r) => ({
      name: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
      lat: r.latitude,
      lng: r.longitude,
      timeZone: r.timezone,
    }))
  }

  return {
    location,
    status,
    message,
    currentMonth,
    init,
    useMyLocation,
    chooseLocation,
    searchCities,
  }
}