<script setup>
const query = `*[_type == "seafood"]{
  _id,
  name,
  "slug": slug.current,
  alternateNames,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  peakMonths,
  limitedMonths,
  frozenMonths,
  flavorRating,
  oilRating,
  textureRating,
  culinaryProfileDescription,
  dishes,
  "waters": waters[]->{ name, latitude, longitude },
  "ingredients": ingredients[]->{ name, category },
  "cookingMethods": cookingMethods[]->name,
  "cuts": cuts[]->{ name, description },
  "catchingMethods": catchingMethods[]->{ name, description }
}`

const { data: seafood } = await useSanityQuery(query)

const { location, currentMonth } = useUserLocation()
const { matchesFilters } = useSeafoodFilters()

const groups = computed(() =>
  buildMonthGroups(seafood.value ?? [], currentMonth.value, location.value),
)

const filteredGroups = computed(() =>
  groups.value
    .map((group) => ({ ...group, items: group.items.filter(matchesFilters) }))
    .filter((group) => group.items.length > 0),
)
</script>

<template>
  <div>
    <h1>Seasonal Seafood</h1>
    <UserLocation />
    <FilterBar :items="seafood ?? []" />

    <div v-if="seafood?.length">
      <SeasonalityKey :show-star="true" />
      <SeasonalityBar :item="seafood[0]" :labeled="true" />
    </div>

    <section v-for="group in filteredGroups" :key="group.month" class="month-group">
      <h2 class="month-group__title">{{ group.name }}</h2>
      <ul class="month-group__list">
        <SeafoodCard
          v-for="item in group.items"
          :key="`${group.month}-${item._id}`"
          :item="item"
        />
      </ul>
    </section>
  </div>
</template>