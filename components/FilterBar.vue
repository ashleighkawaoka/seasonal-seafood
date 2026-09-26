<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
})

const { selectedIngredient, selectedMethod, uniqueNames } = useSeafoodFilters()

const ingredientOptions = computed(() => uniqueNames(props.items, 'ingredients'))
const methodOptions = computed(() => uniqueNames(props.items, 'methods'))
</script>

<template>
  <div class="filter-bar">
    <SelectDropdown
      v-model="selectedIngredient"
      :options="ingredientOptions"
      placeholder="All Ingredients"
    />
    <SelectDropdown
      v-model="selectedMethod"
      :options="methodOptions"
      placeholder="All Methods"
    />
  </div>
</template>