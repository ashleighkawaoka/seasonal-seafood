<script setup>
const props = defineProps({
  fish: { type: Array, default: () => [] },
})

const VISIBLE_COUNT = 5

const search = ref('')
const showAll = ref(false)
const selected = ref([])

const isSearching = computed(() => search.value.trim().length > 0)

const visibleMethods = computed(() => {
  if (isSearching.value) {
    const term = search.value.trim().toLowerCase()
    return COOKING_METHODS.filter((method) => method.title.toLowerCase().includes(term))
  }
  return showAll.value ? COOKING_METHODS : COOKING_METHODS.slice(0, VISIBLE_COUNT)
})

function toggle(value) {
  selected.value = selected.value.includes(value)
    ? selected.value.filter((v) => v !== value)
    : [...selected.value, value]
}

const chips = computed(() => selected.value.map((value) => ({ value, title: methodTitle(value) })))

// Fish must work for every selected method
const results = computed(() => {
  if (!selected.value.length) return props.fish
  return props.fish.filter((fish) =>
    selected.value.every((value) => fish.cookingMethods?.includes(value)),
  )
})
</script>

<template>
  <div class="sort-view sort-view--good-for">
    <section class="filter-panel" aria-label="Good for">
      <div class="filter-panel__body">
        <div class="filter-panel__search">
          <label class="screen-reader-text" for="method-search">Search cooking methods</label>
          <SearchField id="method-search" v-model="search" />
        </div>

        <ul v-if="visibleMethods.length" class="filter-panel__options filter-panel__options--stack">
          <li v-for="method in visibleMethods" :key="method.value">
            <button
              type="button"
              class="filter-panel__option"
              :class="{ 'filter-panel__option--active': selected.includes(method.value) }"
              :aria-pressed="selected.includes(method.value)"
              @click="toggle(method.value)"
            >
              {{ method.title }}
            </button>
          </li>
        </ul>
        <p v-else class="filter-panel__empty">No cooking methods match "{{ search }}"</p>

        <button
          v-if="!isSearching"
          type="button"
          class="filter-panel__more"
          :class="{ 'filter-panel__more--open': showAll }"
          :aria-expanded="showAll"
          @click="showAll = !showAll"
        >
          {{ showAll ? 'View less' : 'View more' }}
          <BaseIcon name="chevron" />
        </button>
      </div>
    </section>

    <section class="sort-view__results" aria-label="Results">
      <FilteredBy :items="chips" placeholder="Select good for..." @remove="toggle" />
      <ul v-if="results.length" class="fish-grid">
        <li v-for="fish in results" :key="fish._id" class="fish-grid__item">
          <FishCard :fish="fish" variant="good-for" :selected="selected" />
        </li>
      </ul>
      <p v-else class="sort-view__empty">No fish work for all of these. Try removing one.</p>
    </section>
  </div>
</template>
