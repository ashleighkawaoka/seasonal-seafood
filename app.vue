<script setup>
const { init } = useUserLocation()
onMounted(init)
</script>

<template>
  <header class="site-header">
    <UserLocation />
    <nav class="site-nav">
      <ul class="site-nav__list">
        <li class="site-nav__item">
          <NuxtLink to="/" class="site-nav__link">Seasonality</NuxtLink>
        </li>
        <li class="site-nav__item">
          <NuxtLink to="/fish-buying-guide" class="site-nav__link">Fish Buying Guide</NuxtLink>
        </li>
        <li class="site-nav__item">
          <NuxtLink to="/seafood-markets" class="site-nav__link">Seafood Markets</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>

  <main class="site-main">
    <NuxtPage />
  </main>
</template>