<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})

function truncatedList(items, max = 3) {
  const names = (items ?? []).map((i) => (typeof i === 'string' ? i : i.name))
  if (names.length === 0) return ''
  if (names.length <= max) return names.join(', ')
  return names.slice(0, max).join(', ') + '...'
}

const pairsWithText = computed(() => truncatedList(props.item.ingredients))
const goodForText = computed(() => truncatedList(props.item.cookingMethods))
</script>

<template>
  <li class="seafood-card">
    <NuxtLink :to="`/fish/${item.slug}`" class="seafood-card__link">
      <img
        v-if="item.imageUrl"
        :src="`${item.imageUrl}?w=600&auto=format`"
        :alt="item.imageAlt || item.name"
        class="seafood-card__image"
      />
      <h3 class="seafood-card__name">{{ item.name }}</h3>
      <p v-if="item.alternateNames" class="seafood-card__alt-names">{{ item.alternateNames }}</p>

      <p v-if="pairsWithText" class="seafood-card__pairs-with">
        <span class="seafood-card__label">Pairs with</span>
        {{ pairsWithText }}
      </p>
      <p v-if="goodForText" class="seafood-card__good-for">
        <span class="seafood-card__label">Good for</span>
        {{ goodForText }}
      </p>

      <SeasonalityBar :item="item" />
    </NuxtLink>
  </li>
</template>