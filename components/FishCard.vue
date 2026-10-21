<script setup>
const props = defineProps({
  fish: { type: Object, required: true },
  // 'taste' | 'good-for' | 'season' | 'full' (All Fish page)
  variant: { type: String, default: 'full' },
  // Taste axes or cooking methods the visitor has selected, these get highlighted
  selected: { type: Array, default: () => [] },
})

const shows = computed(() => ({
  season: props.variant === 'full' || props.variant === 'season',
  taste: props.variant === 'full' || props.variant === 'taste',
  methods: props.variant === 'full' || props.variant === 'good-for',
  pairings: props.variant === 'good-for',
  inSeason: props.variant === 'season',
}))

// All Fish cards show cooking methods as tags, matching the taste profile row
const methodsAsTags = computed(() => props.variant === 'full')

const tasteProfile = computed(() => tasteTags(props.fish))

const inSeasonMonths = computed(() => {
  const months = MONTHS.filter((_, i) => monthStatus(props.fish, i) === 'in-season')
  return months.length === 12 ? ['Year-round'] : months.map((month) => month.short)
})

// Selected methods float to the top of the list
const methods = computed(() =>
  [...(props.fish.cookingMethods ?? [])]
    .sort((a, b) => props.selected.includes(b) - props.selected.includes(a))
    .map((value) => ({ value, title: methodTitle(value), active: props.selected.includes(value) })),
)
</script>

<template>
  <NuxtLink
    :to="`/fish/${fish.slug}`"
    class="fish-card"
    :class="[`fish-card--${variant}`, `fish-card--${fish.habitat}`]"
  >
    <div class="fish-card__media">
      <img
        v-if="fish.imageUrl"
        class="fish-card__image"
        :src="`${fish.imageUrl}?w=${variant === 'full' ? 1200 : 600}&auto=format`"
        :alt="fish.imageAlt || ''"
        loading="lazy"
      />
      <span v-else class="fish-card__placeholder" aria-hidden="true">Image coming soon</span>
    </div>

    <div class="fish-card__body">
      <h3 class="fish-card__name">{{ fish.name }}</h3>

      <SeasonBar v-if="shows.season" class="fish-card__season" :fish="fish" />

      <div v-if="shows.inSeason && inSeasonMonths.length" class="fish-card__group">
        <p class="fish-card__label">In season</p>
        <ul class="fish-card__months">
          <li v-for="month in inSeasonMonths" :key="month" class="fish-card__month">{{ month }}</li>
        </ul>
      </div>

      <div v-if="shows.taste && tasteProfile.length" class="fish-card__group">
        <p class="fish-card__label">Taste profile</p>
        <ul class="fish-card__tags">
          <li v-for="axis in tasteProfile" :key="axis.key">
            <span class="tag fish-card__tag" :class="{ 'tag--active': selected.includes(axis.key) }">
              {{ axis.title }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="shows.methods && methods.length" class="fish-card__group">
        <p class="fish-card__label">Good for</p>
        <ul v-if="methodsAsTags" class="fish-card__tags">
          <li v-for="method in methods" :key="method.value">
            <span class="tag fish-card__tag">{{ method.title }}</span>
          </li>
        </ul>
        <ul v-else class="fish-card__methods">
          <li v-for="method in methods" :key="method.value">
            <span class="fish-card__method" :class="{ 'fish-card__method--active': method.active }">
              {{ method.title }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="shows.pairings && fish.pairings?.length" class="fish-card__group">
        <p class="fish-card__label">Pairs well with</p>
        <p class="fish-card__list">{{ fish.pairings.join(', ') }}</p>
      </div>
    </div>
  </NuxtLink>
</template>
