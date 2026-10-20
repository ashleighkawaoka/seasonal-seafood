<script setup>
const route = useRoute()

const { data: fish } = await useSanityQuery(FISH_DETAIL_QUERY, { slug: route.params.slug })

if (!fish.value) {
  throw createError({ statusCode: 404, statusMessage: 'Fish not found', fatal: true })
}

useHead({ title: fish.value.name })

const profiles = computed(() =>
  TASTE_AXES.map((axis) => ({ ...axis, score: fish.value[axis.key] ?? 0 })),
)
const methods = computed(() => (fish.value.cookingMethods ?? []).map(methodTitle))
</script>

<template>
  <article class="fish-detail">
    <header class="fish-detail__hero">
      <div class="fish-detail__media">
        <img
          v-if="fish.imageUrl"
          class="fish-detail__image"
          :src="`${fish.imageUrl}?w=1000&auto=format`"
          :alt="fish.imageAlt || ''"
        />
        <span v-else class="fish-detail__placeholder" aria-hidden="true">Image coming soon</span>
      </div>
      <h1 class="fish-detail__name">{{ fish.name }}</h1>

      <div class="fish-detail__season">
        <SeasonBar class="fish-detail__season-bar" :fish="fish" labels />
        <SeasonLegend />
      </div>
    </header>

    <section class="fish-detail__section fish-detail__section--chart" aria-labelledby="chart-heading">
      <h2 id="chart-heading" class="screen-reader-text">Taste scores</h2>
      <CoxcombChart class="fish-detail__chart" :fish="fish" />
    </section>

    <section class="fish-detail__section fish-detail__section--similar" aria-labelledby="similar-heading">
      <h2 id="similar-heading" class="fish-detail__heading fish-detail__heading--center">Similar to</h2>
      <ul v-if="fish.similarFish?.length" class="fish-detail__similar-list">
        <li v-for="similar in fish.similarFish" :key="similar._id" class="fish-detail__similar-item">
          <NuxtLink :to="`/fish/${similar.slug}`" class="fish-detail__similar-link">
            <CoxcombChart :fish="similar" :labels="false">{{ similar.name }}</CoxcombChart>
          </NuxtLink>
        </li>
      </ul>
      <p v-else class="fish-detail__text">No other fish on the site taste quite like this one.</p>
    </section>

    <section class="fish-detail__section" aria-labelledby="profiles-heading">
      <h2 id="profiles-heading" class="fish-detail__heading">Taste profiles</h2>
      <ul class="fish-detail__profiles">
        <li v-for="profile in profiles" :key="profile.key" class="fish-detail__profile">
          <h3 class="fish-detail__profile-title">{{ profile.title }}</h3>
          <p class="fish-detail__profile-score">{{ profile.score }} / 10</p>
          <p class="fish-detail__profile-text">{{ profile.description }}</p>
        </li>
      </ul>
    </section>

    <section class="fish-detail__section" aria-labelledby="methods-heading">
      <h2 id="methods-heading" class="fish-detail__heading">Good for</h2>
      <HeartyScale class="fish-detail__hearty" :fish="fish" />
      <ul v-if="methods.length" class="fish-detail__methods">
        <li v-for="method in methods" :key="method" class="fish-detail__method">{{ method }}</li>
      </ul>
      <p v-else class="fish-detail__text">Best used as a flavoring rather than cooked on its own.</p>

      <template v-if="fish.pairings?.length">
        <h3 class="fish-detail__subheading">Pairs well with</h3>
        <p class="fish-detail__pairings">{{ fish.pairings.join(', ') }}</p>
      </template>
    </section>
  </article>
</template>
