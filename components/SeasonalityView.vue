<script setup>
const props = defineProps({
  fish: { type: Array, default: () => [] },
})

const { currentMonth } = useUserLocation()

// Twelve containers starting with the visitor's current month
const groups = computed(() =>
  Array.from({ length: 12 }, (_, offset) => {
    const index = (currentMonth.value - 1 + offset) % 12
    return {
      month: MONTHS[index],
      items: props.fish.filter((fish) => monthStatus(fish, index) === 'in-season'),
    }
  }),
)
</script>

<template>
  <div class="sort-view sort-view--seasonality">
    <div class="sort-view__legend">
      <SeasonLegend />
    </div>

    <div class="sort-view__results">
      <section
        v-for="group in groups"
        :key="group.month.key"
        class="month-group"
        :aria-labelledby="`month-${group.month.key}`"
      >
        <header class="month-group__header">
          <h2 :id="`month-${group.month.key}`" class="month-group__title">{{ group.month.name }}</h2>
          <span class="month-group__count">{{ group.items.length }} fish</span>
        </header>
        <div class="month-group__container">
          <ul v-if="group.items.length" class="fish-grid">
            <li v-for="fish in group.items" :key="fish._id" class="fish-grid__item">
              <FishCard :fish="fish" variant="season" />
            </li>
          </ul>
          <p v-else class="month-group__empty">Nothing in season fresh this month.</p>
        </div>
      </section>
    </div>
  </div>
</template>
