import { createStore, createLogger } from "vuex";
import authState from "./auth.store";
import loaderState from "./loader.store";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    authState,
    loaderState,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
