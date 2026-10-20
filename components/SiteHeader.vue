<script setup>
const route = useRoute()
const router = useRouter()

const links = [
  { to: '/', title: 'Sort by' },
  { to: '/all-fish', title: 'All fish' },
  { to: '/fish-markets', title: 'Fish markets' },
]

const isDetail = computed(() => route.path.startsWith('/fish/'))

// Return to the view the visitor came from, or the home page if they landed here directly
function goBack() {
  if (window.history.state?.back) router.back()
  else navigateTo('/')
}
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="site-header__brand">{{ SITE_NAME }}</NuxtLink>

    <button v-if="isDetail" type="button" class="site-header__back" @click="goBack">
      <BaseIcon name="back" />
      Back to sort by
    </button>

    <nav v-else class="site-nav" aria-label="Main">
      <ul class="site-nav__list">
        <li v-for="link in links" :key="link.to" class="site-nav__item">
          <NuxtLink
            :to="link.to"
            class="site-nav__link"
            :class="{ 'site-nav__link--active': route.path === link.to }"
          >
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
