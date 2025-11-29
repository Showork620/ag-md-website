// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: ['@sidebase/nuxt-auth'],

  auth: {
    baseURL: process.env.NUXT_AUTH_ORIGIN || 'http://localhost:3000',
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: {
      isEnabled: false,
    },
  },
})
