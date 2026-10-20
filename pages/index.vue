<script setup>
const route = useRoute()

const view = computed(() => SORT_VIEWS.find((v) => v.key === route.query.view) ?? null)

const { data } = await useSanityQuery(FISH_LIST_QUERY)
const fish = computed(() => data.value ?? [])

useHead({ title: computed(() => (view.value ? `Sort by ${view.value.title}` : null)) })
</script>

<template>
  <div class="sort-page" :class="{ 'sort-page--intro': !view }">
    <SortTabs :active="view?.key" />
    <TasteView v-if="view?.key === 'taste'" :fish="fish" />
    <GoodForView v-else-if="view?.key === 'good-for'" :fish="fish" />
    <SeasonalityView v-else-if="view?.key === 'seasonality'" :fish="fish" />
  </div>
</template>
