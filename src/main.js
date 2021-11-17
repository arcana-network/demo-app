import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import DKToast from "vue-dk-toast";
import VueGtag from "vue-gtag";
import "@/index.css";

const app = createApp(App);

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
