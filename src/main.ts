import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

// Import main app component and router
import App from './App.vue'
import router from './router'

// Import global styles
import '@/assets/main.css'
import '@/assets/tailwind.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount('#app')
