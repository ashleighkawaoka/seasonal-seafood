<script setup>
const { init } = useUserLocation()
onMounted(init)

const route = useRoute()

// Each sort view has its own color theme, Fish Markets is pink, every other page uses the default red / yellow
const theme = computed(() => {
  if (route.path === '/fish-markets') return 'markets'
  if (route.path !== '/') return 'default'
  return SORT_VIEWS.some((view) => view.key === route.query.view) ? route.query.view : 'default'
})

useHead({
  titleTemplate: (title) => (title ? `${title} | ${SITE_NAME}` : SITE_NAME),
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <div class="site" :class="`site--${theme}`">
    <a href="#main" class="screen-reader-text">Skip to content</a>
    <SiteHeader />
    <LocationBar />
    <main id="main" class="site__main">
      <NuxtPage />
    </main>
  </div>
</template>
