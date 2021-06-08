import { createStore, createLogger } from "vuex";
import authState from "./auth.store";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    authState,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
