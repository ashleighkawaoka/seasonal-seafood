<script setup>
const { location, status, message, nearby, searchCities, chooseLocation, useMyLocation, loadNearby } =
  useUserLocation()

const isOpen = ref(false)
const query = ref('')
const results = ref([])
const isSearching = ref(false)
const isChoosing = ref(false)

// Nearby places take a few seconds to look up, so start as soon as the location is known
// (and again whenever it changes) rather than waiting for the panel to open
onMounted(() => {
  watch(() => `${location.value.lat},${location.value.lng}`, loadNearby, { immediate: true })
})

// Wait 300ms after typing stops before searching
let timer
watch(query, (value) => {
  clearTimeout(timer)
  results.value = [] // don't leave the previous search's results showing

  if (value.trim().length < 2) {
    results.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  timer = setTimeout(async () => {
    let found = []
    try {
      found = await searchCities(value)
    } catch {}
    if (value !== query.value) return // typed something newer, ignore this answer
    results.value = found
    isSearching.value = false
  }, 300)
})

const showEmpty = computed(
  () => !isSearching.value && query.value.trim().length >= 2 && results.value.length === 0,
)

function close() {
  isOpen.value = false
  query.value = ''
  results.value = []
}

async function select(next) {
  isChoosing.value = true
  await chooseLocation(next)
  isChoosing.value = false
  close()
}

async function detect() {
  await useMyLocation()
  if (!message.value) close()
}

function onKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) close()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section class="location-bar" :class="{ 'location-bar--open': isOpen }">
    <button
      type="button"
      class="location-bar__toggle"
      aria-controls="location-panel"
      :aria-expanded="isOpen"
      @click="isOpen ? close() : (isOpen = true)"
    >
      <span class="screen-reader-text">Current location:</span>
      <span class="location-bar__name">{{ location.name }}</span>
      <span class="location-bar__icon"><BaseIcon name="chevron" /></span>
    </button>

    <div v-show="isOpen" id="location-panel" class="location-bar__panel">
      <div class="location-bar__nearby">
        <p class="location-bar__heading">Nearby</p>
        <p v-if="nearby.loading" class="location-bar__status">Finding places near you...</p>
        <ul v-else-if="nearby.places.length" class="location-bar__presets">
          <li v-for="place in nearby.places" :key="place.name">
            <button
              type="button"
              class="location-bar__preset"
              :disabled="isChoosing"
              @click="select(place)"
            >
              {{ place.name }}
            </button>
          </li>
        </ul>
        <p v-else class="location-bar__status">No nearby cities found, try searching instead.</p>
      </div>

      <div class="location-bar__search">
        <label class="location-bar__heading" for="location-search">Search for a city</label>
        <SearchField id="location-search" v-model="query" />
        <ul v-if="results.length" class="location-bar__results">
          <li v-for="result in results" :key="`${result.lat}-${result.lng}`">
            <button
              type="button"
              class="location-bar__result"
              :disabled="isChoosing"
              @click="select(result)"
            >
              {{ result.name }}
            </button>
          </li>
        </ul>
        <p v-if="isSearching" class="location-bar__status">Searching...</p>
        <p v-else-if="showEmpty" class="location-bar__status">No cities found</p>
      </div>

      <button
        type="button"
        class="location-bar__detect"
        :disabled="status === 'locating'"
        @click="detect"
      >
        {{ status === 'locating' ? 'Locating...' : 'Use my location' }}
      </button>
      <p v-if="message" class="location-bar__message">{{ message }}</p>
    </div>
  </section>
</template>
