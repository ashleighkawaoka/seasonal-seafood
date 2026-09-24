export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'o68qy4cg',
    dataset: 'production',
    apiVersion: '2026-09-23',
    useCdn: false, // new data shows up right away
  },
})