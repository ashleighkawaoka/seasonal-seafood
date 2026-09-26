<script setup>
const query = `*[_type == "seafood"]{
  _id,
  name,
  "slug": slug.current,
  peakMonths,
  limitedMonths,
  frozenMonths,
  "waters": waters[]->{ name, latitude, longitude },
  "ingredients": ingredients[]->name,
  "cookingMethods": cookingMethods[]->name
}`

const { data: seafood, error } = await useSanityQuery(query)
</script>

<template>
  <div>
    <h1>Seasonal Seafood</h1>
    <LocationPicker />
    <p v-if="error">Error: {{ error }}</p>
    <pre>{{ seafood }}</pre>
  </div>
</template>