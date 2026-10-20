<script setup>
const { data } = await useSanityQuery(MARKET_LIST_QUERY)
const { location } = useUserLocation()

// Closest market first, numbered in that order
const markets = computed(() =>
  (data.value ?? [])
    .filter((market) => market.location)
    .map((market) => ({
      ...market,
      distance: distanceMiles(location.value, { lat: market.location.lat, lng: market.location.lng }),
    }))
    .sort((a, b) => a.distance - b.distance),
)

const cityLine = ({ city, state, zip } = {}) =>
  [[city, state].filter(Boolean).join(', '), zip].filter(Boolean).join(' ')

const mapsUrl = (address = {}) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street ?? ''}, ${cityLine(address)}`)}`

useHead({ title: 'Fish markets' })
</script>

<template>
  <div class="fish-markets">
    <header class="page-header">
      <h1 class="page-header__title">Fish markets</h1>
    </header>

    <ol v-if="markets.length" class="market-list">
      <li v-for="(market, index) in markets" :key="market._id" class="market-card">
        <p class="market-card__area">{{ market.area }}</p>
        <div class="market-card__body">
          <span class="market-card__number">
            <span class="screen-reader-text">Number</span>
            {{ index + 1 }}
          </span>
          <h2 class="market-card__name">{{ market.name }}</h2>
          <address v-if="market.address" class="market-card__address">
            <a :href="mapsUrl(market.address)" class="market-card__street" target="_blank" rel="noopener">
              {{ market.address.street }}
            </a>
            <span class="market-card__city">{{ cityLine(market.address) }}</span>
          </address>
        </div>
      </li>
    </ol>
    <p v-else class="market-list__empty">No fish markets have been added yet.</p>
  </div>
</template>
