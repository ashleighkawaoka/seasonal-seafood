<script setup>
const { data } = await useSanityQuery(FISH_LIST_QUERY)
const search = ref('')

// Matches anywhere in the name, so "bass" finds Sea Bass
const fish = computed(() => {
  const term = search.value.trim().toLowerCase()
  const all = data.value ?? []
  return term ? all.filter((item) => item.name.toLowerCase().includes(term)) : all
})

useHead({ title: 'All fish' })
</script>

<template>
  <div class="all-fish">
    <header class="page-header">
      <h1 class="page-header__title">All fish</h1>
      <div class="all-fish__search">
        <label class="screen-reader-text" for="fish-search">Search for a fish</label>
        <SearchField id="fish-search" v-model="search" variant="white" placeholder="Search for a fish" />
      </div>
      <ul class="habitat-legend">
        <li
          v-for="habitat in HABITATS"
          :key="habitat.value"
          class="habitat-legend__item"
          :class="`habitat-legend__item--${habitat.value}`"
        >
          <span class="habitat-legend__swatch" aria-hidden="true" />
          {{ habitat.title }}
        </li>
      </ul>
    </header>

    <ul v-if="fish.length" class="fish-grid fish-grid--large">
      <li v-for="item in fish" :key="item._id" class="fish-grid__item">
        <FishCard :fish="item" variant="full" />
      </li>
    </ul>
    <p v-else class="all-fish__empty">No fish match "{{ search }}"</p>
  </div>
</template>
