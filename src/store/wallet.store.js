const state = {
  userInfo: {},
  walletInfo: {},
};

const getters = {
  userInfo: (state) => {
    return state.userInfo;
  },
  walletInfo: (state) => {
    return state.walletInfo;
  },
};

const mutations = {
  addUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  addWalletInfo(state, walletInfo) {
    state.walletInfo = walletInfo;
  },
};

const actions = {
  addUserInfo({ commit }, userInfo) {
    commit("addUserInfo", userInfo);
  },
  addWalletInfo({ commit }, walletInfo) {
    commit("addWalletInfo", walletInfo);
  },
  clearStore({ commit }) {
    commit("addUserInfo", {});
    commit("addWalletInfo", {});
  },
};

const walletState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default walletState;
