const state = {
  walletAddress: "",
};

const getters = {
  walletAddress: (state) => {
    return state.walletAddress
  }
};

const mutations = {
  addWalletAddress(state, walletAddress) {
    state.walletAddress = walletAddress;
  },
};

const actions = {
  addWalletAddress({ commit }, walletAddress) {
    commit("addWalletAddress", walletAddress);
  },
  clearStore({ commit }) {
    commit("addWalletAddress", "");
  },
};

const authState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default authState;
