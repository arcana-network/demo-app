import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import store from "./store";
import DKToast from "vue-dk-toast";
import VueGtag from "vue-gtag";
import { ethers } from "ethers";
import "@/index.css";

// Note: Fagun needs this for testing.
// Remove and uninstall ethers after QA.
window.ethers = ethers;

function getDSN() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_SENTRY_DSN;
  }
  return null;
}

const app = createApp(App);

Sentry.init({
  app,
  dsn: getDSN(),
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: import.meta.env.VITE_SENTRY_TRACING_ORIGIN,
    }),
  ],
  tracesSampleRate: 1.0,
});

app.use(router);
app.use(store);
app.use(DKToast, {
  duration: 5000,
  styles: {
    color: "white",
    boxShadow: "none",
    width: "300px",
    alignSelf: "flex-end",
  },
  positionX: "right",
  positionY: "top",
  disableClick: true,
});

if (import.meta.env.PROD) {
  app.use(VueGtag, {
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID },
  });
}

app.mount("#app");
