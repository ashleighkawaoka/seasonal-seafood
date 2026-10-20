<script setup>
const props = defineProps({
  fish: { type: Array, default: () => [] },
})

// Button order from the mockup
const axes = ['firm', 'tender', 'meaty', 'flaky', 'light', 'rich'].map((key) =>
  TASTE_AXES.find((axis) => axis.key === key),
)

const selected = ref([])

function toggle(key) {
  selected.value = selected.value.includes(key)
    ? selected.value.filter((k) => k !== key)
    : [...selected.value, key]
}

const chips = computed(() => selected.value.map((key) => ({ value: key, title: axisTitle(key) })))

const totalScore = (fish) => selected.value.reduce((sum, key) => sum + (fish[key] ?? 0), 0)

// Fish must match every selected axis, strongest matches first
const results = computed(() => {
  if (!selected.value.length) return props.fish
  return props.fish
    .filter((fish) => selected.value.every((key) => fish.tasteProfile?.includes(key)))
    .sort((a, b) => totalScore(b) - totalScore(a))
})
</script>

<template>
  <div class="sort-view sort-view--taste">
    <section class="filter-panel" aria-label="Taste profiles">
      <div class="filter-panel__body">
        <ul class="filter-panel__options filter-panel__options--row">
          <li v-for="axis in axes" :key="axis.key" class="filter-panel__item">
            <button
              type="button"
              class="filter-panel__option"
              :class="{ 'filter-panel__option--active': selected.includes(axis.key) }"
              :aria-pressed="selected.includes(axis.key)"
              @click="toggle(axis.key)"
            >
              {{ axis.title }}
            </button>
          </li>
        </ul>
      </div>
    </section>

    <section class="sort-view__results" aria-label="Results">
      <FilteredBy :items="chips" placeholder="Select a taste profile" @remove="toggle" />
      <ul v-if="results.length" class="fish-grid">
        <li v-for="fish in results" :key="fish._id" class="fish-grid__item">
          <FishCard :fish="fish" variant="taste" :selected="selected" />
        </li>
      </ul>
      <p v-else class="sort-view__empty">No fish match all of these. Try removing one.</p>
    </section>
  </div>
</template>
