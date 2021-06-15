import { createStore, createLogger } from "vuex";
import authState from "./auth.store";
import loaderState from "./loader.store";

const debug = process.env.NODE_ENV !== "production";

const state = {
  redirectTo: {},
};

const getters = {
  redirectTo: (state) => {
    return state.redirectTo;
  },
};

const mutations = {
  updateRedirect(state, toRoute) {
    state.redirectTo = toRoute;
  },
  removeRedirect(state) {
    state.redirectTo = {};
  },
};

const actions = {
  updateRedirect({ commit }, payload) {
    commit("updateRedirect", payload);
  },
  removeRedirect({ commit }) {
    commit("removeRedirect");
  },
};

const store = createStore({
  modules: {
    authState,
    loaderState,
  },
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
