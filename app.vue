<script setup>
const { init } = useUserLocation()
onMounted(init)
</script>

<template>
  <header class="header">
    <NuxtLink to="/">Seasonal Seafood</NuxtLink>
  </header>

  <main class="site-main">
    <NuxtPage />
  </main>
</template>