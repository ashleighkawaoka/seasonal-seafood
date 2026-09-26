<script setup>
const { location, status, message, searchCities, chooseLocation, useMyLocation } =
  useUserLocation()

const query = ref('')
const results = ref([])
const isOpen = ref(false)
const isSearching = ref(false)
const activeIndex = ref(-1)
const root = ref(null)

// Wait 300ms after typing stops before searching
let timer
watch(query, (value) => {
  clearTimeout(timer)
  activeIndex.value = -1

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
    isOpen.value = true
  }, 300)
})

function select(result) {
  chooseLocation(result)
  query.value = ''
  results.value = []
  isOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    isOpen.value = true
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    select(results.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}

// Close the list when clicking anywhere outside the picker
function onClickOutside(event) {
  if (root.value && !root.value.contains(event.target)) isOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

const showEmpty = computed(
  () =>
    isOpen.value &&
    !isSearching.value &&
    query.value.trim().length >= 2 &&
    results.value.length === 0,
)
</script>

<template>
  <div ref="root" class="location-picker">
    <p class="location-picker__current">
      <span class="location-picker__label">Showing seafood near</span>
      <span class="location-picker__name">{{ location.name }}</span>
    </p>

    <div class="location-picker__field-wrap">
      <label for="location-search" class="screen-reader-text">Search for a city</label>
      <input
        id="location-search"
        v-model="query"
        class="location-picker__field"
        type="text"
        placeholder="Change location..."
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="location-results"
        :aria-expanded="isOpen && results.length > 0"
        :aria-activedescendant="activeIndex >= 0 ? `location-option-${activeIndex}` : undefined"
        @keydown="onKeydown"
        @focus="isOpen = results.length > 0"
      />

      <ul
        v-if="isOpen && results.length"
        id="location-results"
        class="location-picker__list"
        role="listbox"
      >
        <li
          v-for="(result, index) in results"
          :id="`location-option-${index}`"
          :key="`${result.lat}-${result.lng}`"
          class="location-picker__option"
          :class="{ 'is-active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          @click="select(result)"
          @mouseenter="activeIndex = index"
        >
          {{ result.name }}
        </li>
      </ul>

      <p v-if="isSearching" class="location-picker__status">Searching...</p>
      <p v-if="showEmpty" class="location-picker__status">No cities found</p>
    </div>

    <button
      type="button"
      class="location-picker__detect"
      :disabled="status === 'locating'"
      @click="useMyLocation"
    >
      {{ status === 'locating' ? 'Locating...' : 'Use my location' }}
    </button>

    <p v-if="message" class="location-picker__message">{{ message }}</p>
  </div>
</template>