// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'https://eventful-moments-api.onrender.com/api/v1',
    }
  },
  app: {
    head: {
      title: 'Eventful Moments',
      meta: [
        { name: 'description', content: 'An app to store beautiful moments' },
      ],
    },
  },
});
