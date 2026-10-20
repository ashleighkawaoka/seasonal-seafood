<script setup>
defineProps({
  active: { type: String, default: null },
})

const route = useRoute()
</script>

<template>
  <nav class="sort-tabs" aria-label="Sort fish by">
    <p class="sort-tabs__label">Sort by</p>
    <ul class="sort-tabs__list">
      <li v-for="view in SORT_VIEWS" :key="view.key" class="sort-tabs__item">
        <NuxtLink
          :to="{ path: '/', query: { ...route.query, view: view.key } }"
          class="sort-tabs__link"
          :class="{ 'sort-tabs__link--active': view.key === active }"
          :aria-current="view.key === active ? 'page' : undefined"
        >
          {{ view.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
