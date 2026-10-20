export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sanity'],
  css: ['~/scss/main.scss'],
  app: {
    head: {
      link: [{ rel: 'stylesheet', href: 'https://use.typekit.net/eyr6ctn.css' }],
    },
  },
  sanity: {
    projectId: 'o68qy4cg',
    dataset: 'production',
    apiVersion: '2026-09-23',
    useCdn: false, // new data shows up right away
  },
})
