const state = {
  storageLimits: {
    totalStorage: 0,
    storageUsed: 0,
  },
  bandwidthLimits: {
    totalBandwidth: 0,
    bandwidthUsed: 0,
  },
  myFiles: [],
  sharedWithMe: [],
};

const getters = {
  storageLimits: (state) => {
    return {
      totalStorage: state.storageLimits.totalStorage,
      storageUsed: state.storageLimits.storageUsed,
    };
  },
  bandwidthLimits: (state) => {
    return {
      totalBandwidth: state.bandwidthLimits.totalBandwidth,
      bandwidthUsed: state.bandwidthLimits.bandwidthUsed,
    };
  },
  myFiles: (state) => {
    return state.myFiles;
  },
  sharedWithMe: (state) => {
    return state.sharedWithMe;
  },
};

const mutations = {
  updateStorageLimits(state, { totalStorage, storageUsed }) {
    state.storageLimits.totalStorage = totalStorage;
    state.storageLimits.storageUsed = storageUsed;
  },
  updateBandwidthLimits(state, { totalBandwidth, bandwidthUsed }) {
    state.bandwidthLimits.totalBandwidth = totalBandwidth;
    state.bandwidthLimits.bandwidthUsed = bandwidthUsed;
  },
  updateMyFiles(state, myFiles) {
    state.myFiles = myFiles.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
  updateSharedWithMe(state, sharedWithMe) {
    state.sharedWithMe = sharedWithMe.map((file) => {
      file.fileId = file.did;
      return file;
    });
  },
};

const actions = {
  updateStorageLimits({ commit }, { totalStorage, storageUsed }) {
    commit("updateStorageLimits", { totalStorage, storageUsed });
  },
  updateBandwidthLimits({ commit }, { totalBandwidth, bandwidthUsed }) {
    commit("updateBandwidthLimits", { totalBandwidth, bandwidthUsed });
  },
  updateSharedWithMe({ commit }, sharedWithMe) {
    commit("updateSharedWithMe", sharedWithMe);
  },
  updateMyFiles({ commit }, myFiles) {
    commit("updateMyFiles", myFiles);
  },
};

const storageState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default storageState;
