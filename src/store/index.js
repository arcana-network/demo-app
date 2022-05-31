import { createStore, createLogger } from "vuex";

import loaderState from "./loader.store";
import storageState from "./storage.store";
import walletState from "./wallet.store";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    loaderState,
    storageState,
    walletState,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
