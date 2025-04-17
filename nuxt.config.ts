// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  app: {
    head: {
      title: "Masters",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { 'http-equiv': 'Content-Security-Policy"', content: 'upgrade-insecure-requests' },
      ]
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern' 
        }
      }
    }
  },
  modules: ['@pinia/nuxt', '@nuxt/image'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.APP_API_KEY,
        authDomain: process.env.APP_AUTH_DOMAIN,
        projectId: process.env.APP_PROJECT_ID,
        storageBucket: process.env.APP_STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
      }
    }
  }
});