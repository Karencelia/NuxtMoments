// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'https://eventful-moments-api.onrender.com/api/v1',
    }
  }
});
