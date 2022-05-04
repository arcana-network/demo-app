import { Integrations } from '@sentry/tracing'
import { init, vueRouterInstrumentation } from '@sentry/vue'
import { createApp } from 'vue'
import DKToast from 'vue-dk-toast'
import VueGtag from 'vue-gtag'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/index.css'

function getDSN() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_SENTRY_DSN
  }
  return null
}

const app = createApp(App)

init({
  app,
  dsn: getDSN(),
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: vueRouterInstrumentation(router),
      tracingOrigins: import.meta.env.VITE_SENTRY_TRACING_ORIGIN,
    }),
  ],
  tracesSampleRate: 1.0,
})

app.use(router)
app.use(store)
app.use(DKToast, {
  duration: 5000,
  styles: {
    color: 'white',
    boxShadow: 'none',
    width: '300px',
    alignSelf: 'flex-end',
  },
  positionX: 'right',
  positionY: 'top',
  disableClick: true,
})

if (import.meta.env.PROD) {
  app.use(VueGtag, {
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID },
  })
}

app.mount('#app')
