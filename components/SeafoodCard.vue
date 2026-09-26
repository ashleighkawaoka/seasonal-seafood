<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})

const waterNames = computed(() => props.item.waters.map((w) => w.name).join(', '))
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
      <p class="seafood-card__water">{{ waterNames }}</p>
    </NuxtLink>
  </li>
</template>