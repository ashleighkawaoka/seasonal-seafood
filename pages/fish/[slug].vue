<script setup>
const route = useRoute()

const query = `*[_type == "seafood" && slug.current == $slug][0]{
  _id,
  name,
  alternateNames,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  peakMonths,
  limitedMonths,
  frozenMonths,
  buyGuidance,
  avoidGuidance,
  flavorRating,
  oilRating,
  textureRating,
  culinaryProfileDescription,
  dishes,
  "ingredients": ingredients[]->{ name, category },
  "cookingMethods": cookingMethods[]->name,
  "cuts": cuts[]->{ name, description },
  "catchingMethods": catchingMethods[]->{ name, description },
  "waters": waters[]->{ name, latitude, longitude }
}`

const { data: fish } = await useSanityQuery(query, { slug: route.params.slug })

if (!fish.value) {
  throw createError({ statusCode: 404, statusMessage: 'Fish not found' })
}
</script>

<template>
  <article class="fish-detail">
    <NuxtLink to="/" class="fish-detail__back-link">← Back to all seafood</NuxtLink>
    <h1 class="fish-detail__name">{{ fish.name }}</h1>
    <p v-if="fish.alternateNames" class="fish-detail__alt-names">{{ fish.alternateNames }}</p>

    <img
      v-if="fish.imageUrl"
      :src="`${fish.imageUrl}?w=1200&auto=format`"
      :alt="fish.imageAlt || fish.name"
      class="fish-detail__image"
    />

    <SeasonalityBar :item="fish" :labeled="true" />
    <SeasonalityKey :show-star="false" />

    <section v-if="fish.buyGuidance?.length || fish.avoidGuidance?.length" class="fish-detail__buying-guide">
      <h2>Buying Guide</h2>
      <div class="fish-detail__buy">
        <h3>Buy</h3>
        <ul v-if="fish.buyGuidance?.length">
          <li v-for="(item, i) in fish.buyGuidance" :key="i">{{ item }}</li>
        </ul>
      </div>
      <div class="fish-detail__avoid">
        <h3>Avoid</h3>
        <ul v-if="fish.avoidGuidance?.length">
          <li v-for="(item, i) in fish.avoidGuidance" :key="i">{{ item }}</li>
        </ul>
        <p v-else>There are no red ratings for {{ fish.name }}.</p>
      </div>
    </section>

    <section v-if="fish.flavorRating" class="fish-detail__culinary-profile">
      <h2>Culinary Profile</h2>
      <p>Flavor: {{ fish.flavorRating }}/5</p>
      <p>Oil: {{ fish.oilRating }}/5</p>
      <p>Texture: {{ fish.textureRating }}/5</p>
      <p v-if="fish.culinaryProfileDescription">{{ fish.culinaryProfileDescription }}</p>
    </section>

    <section v-if="fish.ingredients?.length" class="fish-detail__pairs-with">
      <h2>Pairs well with</h2>
      <ul>
        <li v-for="ingredient in fish.ingredients" :key="ingredient.name">{{ ingredient.name }}</li>
      </ul>
    </section>

    <section v-if="fish.cookingMethods?.length" class="fish-detail__good-for">
      <h2>Good for</h2>
      <ul>
        <li v-for="method in fish.cookingMethods" :key="method">{{ method }}</li>
      </ul>
    </section>

    <section v-if="fish.dishes?.length" class="fish-detail__dishes">
      <h2>Famous Dishes</h2>
      <ul>
        <li v-for="dish in fish.dishes" :key="dish.name">
          <a v-if="dish.link" :href="dish.link" target="_blank" rel="noopener">{{ dish.name }}</a>
          <span v-else>{{ dish.name }}</span>
        </li>
      </ul>
    </section>

    <section v-if="fish.cuts?.length" class="fish-detail__cuts">
      <h2>What cut to catch</h2>
      <dl>
        <template v-for="cut in fish.cuts" :key="cut.name">
          <dt>{{ cut.name }}</dt>
          <dd>{{ cut.description }}</dd>
        </template>
      </dl>
    </section>

    <section v-if="fish.catchingMethods?.length || fish.waters?.length" class="fish-detail__sourcing">
      <h2>Catching Method</h2>
      <p v-if="fish.waters?.length">
        <strong>Sourced from:</strong> {{ fish.waters.map((w) => w.name).join(', ') }}
      </p>
      <dl v-if="fish.catchingMethods?.length">
        <template v-for="method in fish.catchingMethods" :key="method.name">
          <dt>{{ method.name }}</dt>
          <dd>{{ method.description }}</dd>
        </template>
      </dl>
    </section>
  </article>
</template>