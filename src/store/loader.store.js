const state = {
  fullScreen: {
    isLoading: false,
    loadingMessage: "",
  },
  inline: {
    isLoading: false,
    loadingMessage: "",
  },
};

const getters = {
  isLoadingFullScreen: (state) => {
    return state.fullScreen.isLoading;
  },
  fullScreenLoadingMessage: (state) => {
    return state.fullScreen.loadingMessage;
  },
  isLoadingInline: (state) => {
    return state.inline.isLoading;
  },
  inlineLoadingMessage: (state) => {
    return state.inline.loadingMessage;
  },
};

const mutations = {
  updateIsLoadingFullScreen(state, isLoading) {
    state.fullScreen.isLoading = isLoading;
  },
  updateFullScreenLoadingMessage(state, loadingMessage) {
    state.fullScreen.loadingMessage = loadingMessage;
  },
  updateIsLoadingInline(state, isLoading) {
    state.inline.isLoading = isLoading;
  },
  updateFullScreenInline(state, loadingMessage) {
    state.inline.loadingMessage = loadingMessage;
  },
};

const actions = {
  showFullScreenLoader({ commit }, loadingMessage) {
    commit("updateIsLoadingFullScreen", true);
    commit("updateFullScreenLoadingMessage", loadingMessage);
  },
  hideFullScreenLoader({ commit }) {
    commit("updateIsLoadingFullScreen", false);
    commit("updateFullScreenLoadingMessage", "");
  },
  showInlineLoader({ commit }, loadingMessage) {
    commit("updateIsLoadingInline", true);
    commit("updateFullScreenInline", loadingMessage);
  },
  hideInlineLoader({ commit }, loadingMessage) {
    commit("updateIsLoadingInline", false);
    commit("updateFullScreenInline", "");
  },
};

const loaderState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default loaderState;
